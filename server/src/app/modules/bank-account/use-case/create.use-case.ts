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
        .min(1, { message: 'O nome é obrigatório' })
        .transform(val => val.replace(/ {2}/g, ' ')),
    email: ValidatorService.schema.string().email({ message: 'E-mail inválido' }).trim().min(1, { message: 'O e-mail é obrigatório' }),
    password: ValidatorService.schema.string().trim().min(1, { message: 'A senha é obrigatória' }),
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
        const { email, name, password } = this.validateDTO(args)

        await this.validBankAccountEmailAlreadyExists(email)

        const passwordHash = this.cryptPassword(password)
        await this.registerBankAccount({ email, name, password: passwordHash })

        return Result.success({ message: 'Conta registrada com sucesso' })
    }

    private validateDTO(args: BankAccountCreateDTOArgs) {
        return this.validator.performParse(args, schemaDTO).getValue()
    }

    private async validBankAccountEmailAlreadyExists(email: string) {
        const accountAlreadyExistsByEmailResult = await this.repository.findByEmail(email)

        if (accountAlreadyExistsByEmailResult.isSuccess()) {
            throw new BadRequestException({
                ...accountAlreadyExistsByEmailResult.getError(),
                title: 'Registrar Conta',
                message: 'Email já está em uso',
            })
        }
    }

    private cryptPassword(password: string) {
        return this.crypto.cryptoES.MD5(password).toString()
    }

    private async registerBankAccount({ email, name, password }: BankAccountCreateDTOArgs) {
        const registerBankAccountResult = await this.repository.register({ email, name, password, balance: 0 })

        if (!registerBankAccountResult.isSuccess()) {
            throw new BadRequestException({
                ...registerBankAccountResult.getError(),
                title: 'Registrar Conta',
                message: `Não foi registrar a conta. Erro: "${registerBankAccountResult.getError().message}"`,
            })
        }
    }
}
