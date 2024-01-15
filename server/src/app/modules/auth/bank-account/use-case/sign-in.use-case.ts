import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { ID, PayloadJWTCustomerBankAccount } from '@@types'
import { GLOBAL_APP, GLOBAL_MAIL_CONFIG, GLOBAL_SERVER_JWT_TOKEN } from '@global'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { CryptoService } from '@services/crypto.service'
import { JWTService } from '@services/jwt.service'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { UserRepository } from '@modules/user/user.repository'
import { GLOBAL_BANK_ACCOUNT_DTO } from '@modules/bank-account/bank-account.global'
import { BankAccountRepository } from '@modules/bank-account/bank-account.repository'
import { BankAccountGenerateCodeUseCase } from '@modules/bank-account/use-case/generate-code.use-case'
import { MailCreateUseCase } from '@modules/notification/mail/use-case/create.use-case'
import { UserModel } from '@modules/user/user.model'
import { BankAccountSignInTemplate } from '@templates/bank-account-sing-in'

const schemaDTO = ValidatorService.schema.object({
    peopleId: GLOBAL_BANK_ACCOUNT_DTO.people.id,
    code: ValidatorService.schema
        .string({ 'required_error': GLOBAL_BANK_ACCOUNT_DTO.code.messageRequired })
        .trim(),
    password: ValidatorService.schema
        .string({ 'required_error': GLOBAL_BANK_ACCOUNT_DTO.password.messageRequired })
        .trim()
})

export type AuthSignInDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'auth.bank-account.use-case.sign-in' })
export class AuthBankAccountSignInUseCase extends UseCase {
    constructor(
        @Injection.Inject('user.repository') private userRepository: UserRepository,
        @Injection.Inject('bank-account.repository') private bankAccountRepository: BankAccountRepository,
        @Injection.Inject('bank-account.use-case.generate-code') private bankAccountGenerateCodeUC: BankAccountGenerateCodeUseCase,
        @Injection.Inject('crypto') private crypto: CryptoService,
        @Injection.Inject('jwt') private jwt: JWTService,
        @Injection.Inject('mail.use-case.create') private mailCreateUC: MailCreateUseCase,
    ) {
        super()
    }

    async perform(args: AuthSignInDTOArgs) {
        const transaction = this.database.transaction()

        try {
            await transaction.begin()
            const result = await this.performUC(args)
            await transaction.commit()
            return result
        } catch (err: any) {
            await transaction.rollback()
            throw err
        }
    }

    private async performUC(args: AuthSignInDTOArgs) {
        const { code, password, peopleId } = this.validateDTO(args, schemaDTO)

        this.validCode(code)
        const user = await this.queryUserByPeopleId(peopleId)
        const bankAccount = await this.queryBankAccountByCode(code, peopleId)
        await this.validPasswordBankAccount(password, bankAccount.password)
        const token = this.generateToken({ sub: user.id, email: user.login, name: user.people.name, bankAccount: bankAccount.id, peopleId })
        await this.createMail({ peopleId })

        return Result.success({ token })
    }

    private validCode(code: string) {
        if (!this.bankAccountGenerateCodeUC.valid(code).isSuccess()) {
            throw new BadRequestException({ title: 'Sign-in Bank Account', message: 'Code or Password invalid. Please, try again later' })
        }
    }

    private async queryUserByPeopleId(peopleId: number) {
        const userResult = await this.userRepository.findFirst({
            where: { peopleId },
            include: { people: true }
        })

        if (userResult.isSuccess()) {
            return userResult.getValue()
        }

        if (userResult.isErrorInOperation()) {
            throw new BadRequestException({ ...userResult.getError(), title: 'Sign-in Bank Account' })
        }

        throw new BadRequestException({ title: 'Sign-in Bank Account', message: 'Code or Password invalid. Please, try again later' })
    }

    private async queryBankAccountByCode(code: string, peopleId: number) {
        const userResult = await this.bankAccountRepository.findUnique({ where: { code, peopleId } })

        if (userResult.isSuccess()) {
            return userResult.getValue()
        }

        if (userResult.isErrorInOperation()) {
            throw new BadRequestException({ ...userResult.getError(), title: 'Sign-in Bank Account' })
        }

        throw new BadRequestException({ title: 'Sign-in Bank Account', message: 'Code or Password invalid. Please, try again later' })
    }

    private async validPasswordBankAccount(password: string, passwordHash: string) {
        const isSamePassword = await this.crypto.bcrypto.compare(password, passwordHash)

        if (!isSamePassword) {
            throw new BadRequestException({ title: 'Sign-in Bank Account', message: 'Code or Password invalid. Please, try again later' })
        }
    }

    private generateToken({ sub, email, name, bankAccount, peopleId }: PayloadJWTCustomerBankAccount) {
        return this.jwt.encode<PayloadJWTCustomerBankAccount>(
            { sub, name, email, bankAccount, peopleId },
            { exp: GLOBAL_SERVER_JWT_TOKEN.expiresTime, secret: GLOBAL_SERVER_JWT_TOKEN.keyBank },
        )
    }

    private async createMail({ peopleId }: { peopleId: ID }) {
        const { id, people: { users, name }, name: bankAccountName } = await this.queryCustomerPeople(peopleId)

        const user = users[0]

        if (!user) {
            throw new BadRequestException({ title: 'Query User', message: 'User not registered to this people' })
        }

        const resultTemplate = BankAccountSignInTemplate({ bankAccountName })

        if (!resultTemplate.isSuccess()) {
            throw new BadRequestException({ title: 'Create E-mail', message: 'Unable to create a e-mail' })
        }

        const result = await this.mailCreateUC.perform({
            bankAccountId: id,
            sender: `${GLOBAL_APP.name} <${GLOBAL_MAIL_CONFIG.domain}>`,
            recipient: `${name} <${user.login}>`,
            subject: 'Financial Portal: Sign-in a bank account',
            content: resultTemplate.getValue(),
        })

        if (!result.isSuccess()) {
            throw new BadRequestException(result.getError())
        }
    }

    private async queryCustomerPeople(id: ID) {
        const result = await this.bankAccountRepository.findFirst({ where: { peopleId: id }, orderBy: { id: 'desc' }, include: { people: { include: { users: { where: { type: UserModel.Type.CUSTOMER }, take: 1 } } } } })

        if (!result.isSuccess()) {
            throw new BadRequestException({
                ...result.getError(),
                title: 'Query People',
            })
        }

        return result.getValue()
    }
}
