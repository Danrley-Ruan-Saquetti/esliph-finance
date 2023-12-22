import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { GLOBAL_DTO } from '@global'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { CryptoService } from '@services/crypto.service'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { GLOBAL_BANK_ACCOUNT_DTO } from '@modules/bank-account/bank-account.global'
import { BankAccountRepository } from '@modules/bank-account/bank-account.repository'
import { BankAccountGenerateCodeUseCase } from '@modules/bank-account/use-case/generate-code.use-case'

const schemaDTO = ValidatorService.schema.object({
    name: ValidatorService.schema
        .string()
        .trim()
        .min(1, { message: GLOBAL_BANK_ACCOUNT_DTO.name.messageRequired })
        .min(GLOBAL_BANK_ACCOUNT_DTO.name.minCharacters, { message: GLOBAL_BANK_ACCOUNT_DTO.name.messageMinCharacters })
        .transform(GLOBAL_DTO.text.transform),
    userId: GLOBAL_BANK_ACCOUNT_DTO.user.id,
    passwordMaster: ValidatorService.schema
        .string()
        .trim()
        .min(1, { message: GLOBAL_BANK_ACCOUNT_DTO.passwordMaster.messageRequired })
        .regex(GLOBAL_BANK_ACCOUNT_DTO.passwordMaster.regex, { message: GLOBAL_BANK_ACCOUNT_DTO.passwordMaster.messageRegex }),
})

export type BankAccountCreateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'bank-account.use-case.create' })
export class BankAccountCreateUseCase extends UseCase {
    constructor(
        @Injection.Inject('account.repository') private repository: BankAccountRepository,
        @Injection.Inject('crypto') private crypto: CryptoService,
        @Injection.Inject('bank-account.use-case.generate-code') private bankAccountGenerateCodeUC: BankAccountGenerateCodeUseCase,
    ) {
        super()
    }

    async perform(args: BankAccountCreateDTOArgs) {
        const { name, passwordMaster, userId } = this.validateDTO(args, schemaDTO)

        const passwordMasterHash = this.cryptPassword(passwordMaster)
        const code = await this.generateCode()
        await this.registerBankAccount({ name, passwordMaster: passwordMasterHash, userId, code })

        return Result.success({ message: 'Bank account registered successfully' })
    }

    private cryptPassword(password: string) {
        return this.crypto.bcrypto.hashSync(password, 5)
    }

    private async generateCode() {
        const codeResult = await this.bankAccountGenerateCodeUC.perform()

        if (codeResult.isSuccess()) {
            throw new BadRequestException({
                ...codeResult.getError(),
                title: 'Register Bank Account',
            })
        }

        return codeResult.getValue().code
    }

    private async registerBankAccount({ name, passwordMaster, userId, code }: BankAccountCreateDTOArgs & { code: string }) {
        const registerBankAccountResult = await this.repository.register({ balance: 0, name, passwordMaster, userId, code })

        if (registerBankAccountResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...registerBankAccountResult.getError(),
            title: 'Register Bank Account',
            message: `Unable to register bank account. Error: "${registerBankAccountResult.getError().message}"`,
        })
    }
}
