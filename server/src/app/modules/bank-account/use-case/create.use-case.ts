import { ID } from '@@types'
import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { GLOBAL_APP, GLOBAL_DTO } from '@global'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { CryptoService } from '@services/crypto.service'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { GLOBAL_BANK_ACCOUNT_DTO } from '@modules/bank-account/bank-account.global'
import { BankAccountRepository } from '@modules/bank-account/bank-account.repository'
import { BankAccountGenerateCodeUseCase } from '@modules/bank-account/use-case/generate-code.use-case'
import { MailCreateUseCase } from '@modules/notification/mail/use-case/create.use-case'
import { UserRepository } from '@modules/user/user.repository'
import { UserModel } from '@modules/user/user.model'

const schemaDTO = ValidatorService.schema.object({
    peopleId: GLOBAL_BANK_ACCOUNT_DTO.people.id,
    name: ValidatorService.schema
        .string({ 'required_error': GLOBAL_BANK_ACCOUNT_DTO.name.messageRequired })
        .trim()
        .min(GLOBAL_BANK_ACCOUNT_DTO.name.minCharacters, { message: GLOBAL_BANK_ACCOUNT_DTO.name.messageRangeCharacters })
        .max(GLOBAL_BANK_ACCOUNT_DTO.name.maxCharacters, { message: GLOBAL_BANK_ACCOUNT_DTO.name.messageRangeCharacters })
        .transform(GLOBAL_DTO.text.transform),
    password: ValidatorService.schema
        .string({ 'required_error': GLOBAL_BANK_ACCOUNT_DTO.password.messageRequired })
        .trim()
        .regex(GLOBAL_BANK_ACCOUNT_DTO.password.regex, { message: GLOBAL_BANK_ACCOUNT_DTO.password.messageRegex }),
})

export type BankAccountCreateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'bank-account.use-case.create' })
export class BankAccountCreateUseCase extends UseCase {
    constructor(
        @Injection.Inject('bank-account.repository') private bankAccountRepository: BankAccountRepository,
        @Injection.Inject('user.repository') private userRepository: UserRepository,
        @Injection.Inject('crypto') private crypto: CryptoService,
        @Injection.Inject('bank-account.use-case.generate-code') private bankAccountGenerateCodeUC: BankAccountGenerateCodeUseCase,
        @Injection.Inject('mail.use-case.create') private mailCreateUC: MailCreateUseCase,
    ) {
        super()
    }

    async perform(args: BankAccountCreateDTOArgs) {
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

    private async performUC(args: BankAccountCreateDTOArgs) {
        const { name, password, peopleId } = this.validateDTO(args, schemaDTO)

        const passwordHash = this.cryptPassword(password)
        const code = await this.generateCode()
        await this.registerBankAccount({ name, password: passwordHash, peopleId, code })
        await this.createMail({ peopleId })

        return Result.success({ message: 'Bank account registered successfully' })
    }

    private cryptPassword(password: string) {
        return this.crypto.bcrypto.hashSync(password, 5)
    }

    private async generateCode() {
        const codeResult = await this.bankAccountGenerateCodeUC.generate()

        if (!codeResult.isSuccess()) {
            throw new BadRequestException({
                ...codeResult.getError(),
                title: 'Register Bank Account',
            })
        }

        return codeResult.getValue().code
    }

    private async registerBankAccount({ name, password, peopleId, code }: SchemaValidator.output<typeof schemaDTO> & { code: string }) {
        const registerBankAccountResult = await this.bankAccountRepository.create({ data: { balance: 0, name, password, people: { connect: { id: peopleId } }, code } })

        if (registerBankAccountResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...registerBankAccountResult.getError(),
            title: 'Register Bank Account',
        })
    }

    private async createMail({ peopleId }: { peopleId: ID }) {
        const { id, code, people: { users, name } } = await this.queryCustomerPeople(peopleId)

        const user = users[0]

        if (!user) {
            throw new BadRequestException({ title: 'Query User', message: 'User not registered to this people' })
        }

        const result = await this.mailCreateUC.perform({
            bankAccountId: id,
            sender: `${GLOBAL_APP.name} <${GLOBAL_APP.mail}>`,
            recipient: user.login,
            subject: 'Financial Portal: Creating a new bank account',
            content: '',
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
