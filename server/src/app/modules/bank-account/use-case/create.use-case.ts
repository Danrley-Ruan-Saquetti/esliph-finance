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
        .string({ 'required_error': GLOBAL_BANK_ACCOUNT_DTO.name.messageRequired })
        .trim()
        .min(GLOBAL_BANK_ACCOUNT_DTO.name.minCharacters, { message: GLOBAL_BANK_ACCOUNT_DTO.name.messageRangeCharacters })
        .max(GLOBAL_BANK_ACCOUNT_DTO.name.maxCharacters, { message: GLOBAL_BANK_ACCOUNT_DTO.name.messageRangeCharacters })
        .transform(GLOBAL_DTO.text.transform),
    peopleId: GLOBAL_BANK_ACCOUNT_DTO.people.id,
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
        @Injection.Inject('crypto') private crypto: CryptoService,
        @Injection.Inject('bank-account.use-case.generate-code') private bankAccountGenerateCodeUC: BankAccountGenerateCodeUseCase,
    ) {
        super()
    }

    async perform(args: BankAccountCreateDTOArgs) {
        const { name, password, peopleId } = this.validateDTO(args, schemaDTO)

        const passwordHash = this.cryptPassword(password)
        const code = await this.generateCode()
        await this.registerBankAccount({ name, password: passwordHash, peopleId, code })

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
        const registerBankAccountResult = await this.bankAccountRepository.register({ balance: 0, name, password, peopleId, code })

        if (registerBankAccountResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...registerBankAccountResult.getError(),
            title: 'Register Bank Account',
        })
    }
}
