import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { UseCase } from '@common/use-case'
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
export class BankAccountCreateUseCase extends UseCase {
    constructor(
        @Injection.Inject('account.repository') private repository: BankAccountRepository,
        @Injection.Inject('crypto') private crypto: CryptoService,
    ) {
        super()
    }

    async perform(args: BankAccountCreateDTOArgs) {
        const { name, passwordMaster, userId } = this.validateDTO(args, schemaDTO)

        const passwordMasterHash = this.cryptPassword(passwordMaster)
        await this.registerBankAccount({ name, passwordMaster: passwordMasterHash, userId })

        return Result.success({ message: 'Bank account registered successfully' })
    }

    private cryptPassword(password: string) {
        return this.crypto.bcrypto.hashSync(password, 5)
    }

    private async registerBankAccount({ name, passwordMaster, userId }: BankAccountCreateDTOArgs) {
        const registerBankAccountResult = await this.repository.register({ balance: 0, name, passwordMaster, userId })

        if (!registerBankAccountResult.isSuccess()) {
            throw new BadRequestException({
                ...registerBankAccountResult.getError(),
                title: 'Register Bank Account',
                message: `Cannot register bank account. Error: "${registerBankAccountResult.getError().message}"`,
            })
        }
    }
}
