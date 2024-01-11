import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { PayloadJWTUserBankAccount } from '@@types'
import { GLOBAL_SERVER_JWT_TOKEN } from '@global'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { CryptoService } from '@services/crypto.service'
import { JWTService } from '@services/jwt.service'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { UserRepository } from '@modules/user/user.repository'
import { GLOBAL_BANK_ACCOUNT_DTO } from '@modules/bank-account/bank-account.global'
import { BankAccountRepository } from '@modules/bank-account/bank-account.repository'
import { BankAccountGenerateCodeUseCase } from '@modules/bank-account/use-case/generate-code.use-case'

const schemaDTO = ValidatorService.schema.object({
    userId: GLOBAL_BANK_ACCOUNT_DTO.user.id,
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
    ) {
        super()
    }

    async perform(args: AuthSignInDTOArgs) {
        const { code, password, userId } = this.validateDTO(args, schemaDTO)

        this.validCode(code)
        const user = await this.queryUserByUserId(userId)
        const bankAccount = await this.queryBankAccountByCode(code, userId)
        await this.validPasswordBankAccount(password, bankAccount.password)
        const token = this.generateToken({ sub: user.id, email: user.login, name: '', bankAccount: bankAccount.id })

        return Result.success({ token })
    }

    private validCode(code: string) {
        if (!this.bankAccountGenerateCodeUC.valid(code).isSuccess()) {
            throw new BadRequestException({ title: 'Sign-in Bank Account', message: 'Code or Password invalid. Please, try again later' })
        }
    }

    private async queryUserByUserId(userId: number) {
        const userResult = await this.userRepository.findById(userId)

        if (userResult.isSuccess()) {
            return userResult.getValue()
        }

        if (userResult.isErrorInOperation()) {
            throw new BadRequestException({ ...userResult.getError(), title: 'Sign-in Bank Account' })
        }

        throw new BadRequestException({ title: 'Sign-in Bank Account', message: 'Code or Password invalid. Please, try again later' })
    }

    private async queryBankAccountByCode(code: string, userId: number) {
        const userResult = await this.bankAccountRepository.findByCodeAndIdUser(code, userId)

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

    private generateToken({ sub, email, name, bankAccount }: PayloadJWTUserBankAccount) {
        return this.jwt.encode<PayloadJWTUserBankAccount>(
            { sub, name, email, bankAccount },
            { exp: GLOBAL_SERVER_JWT_TOKEN.expiresTime, secret: GLOBAL_SERVER_JWT_TOKEN.keyBank },
        )
    }
}
