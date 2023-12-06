import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { BadRequestException } from '@common/exceptions'
import { CryptoService } from '@services/crypto.service'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { BankAccountRepository } from '@modules/bank-account/bank-account.repository'

const schemaDTO = ValidatorService.schema.object({
    name: ValidatorService.schema
        .string()
        .trim()
        .min(1, { message: 'Name is required' })
        .transform(val => val.replace(/ {2}/g, ' ')),
    userId: ValidatorService.schema.coerce.number({ required_error: 'ID User is required' }).positive({ message: 'Invalid ID User' }),
    passwordMaster: ValidatorService.schema.string().trim().min(1, { message: 'Password is required' }),
})

export type BankAccountCreateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'bank-account.use-case.create' })
export class BankAccountCreateUseCase {
    constructor(
        @Injection.Inject('account.repository') private repository: BankAccountRepository,
        @Injection.Inject('crypto') private crypto: CryptoService,
        @Injection.Inject('validator') private validator: ValidatorService,
    ) {}

    async perform(args: BankAccountCreateDTOArgs) {
        const { name, passwordMaster, userId } = this.validateDTO(args)

        const passwordMasterHash = this.cryptPassword(passwordMaster)
        await this.registerBankAccount({ name, passwordMaster: passwordMasterHash, userId })

        return Result.success({ message: 'Conta registrada com sucesso' })
    }

    private validateDTO(args: BankAccountCreateDTOArgs) {
        return this.validator.performParse(args, schemaDTO).getValue()
    }

    private cryptPassword(password: string) {
        return this.crypto.bcrypto.hashSync(password, 5)
    }

    private async registerBankAccount({ name, passwordMaster, userId }: BankAccountCreateDTOArgs) {
        const registerBankAccountResult = await this.repository.register({ balance: 0, name, passwordMaster, userId })

        if (!registerBankAccountResult.isSuccess()) {
            throw new BadRequestException({
                ...registerBankAccountResult.getError(),
                title: 'Registrar Conta',
                message: `Não foi registrar a conta. Erro: "${registerBankAccountResult.getError().message}"`,
            })
        }
    }
}
