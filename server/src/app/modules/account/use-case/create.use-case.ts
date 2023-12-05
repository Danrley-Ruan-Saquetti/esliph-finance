import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { BadRequestException } from '@common/exceptions'
import { CryptoService } from '@services/crypto.service'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { AccountRepository } from '@modules/account/account.repository'

const schemaDTO = ValidatorService.schema.object({
    name: ValidatorService.schema
        .string()
        .trim()
        .min(1, { message: 'O nome é obrigatório' })
        .transform(val => val.replace(/ {2}/g, ' ')),
    email: ValidatorService.schema.string().email({ message: 'E-mail inválido' }).trim().min(1, { message: 'O e-mail é obrigatório' }),
    password: ValidatorService.schema.string().trim().min(1, { message: 'A senha é obrigatória' }),
})

export type AccountCreateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'account.use-case.create' })
export class AccountCreateUseCase {
    constructor(
        @Injection.Inject('account.repository') private repository: AccountRepository,
        @Injection.Inject('crypto') private crypto: CryptoService,
        @Injection.Inject('validator') private validator: ValidatorService,
    ) {}

    async perform(args: AccountCreateDTOArgs) {
        const { email, name, password } = this.validateDTO(args)

        await this.validAccountEmailAlreadyExists(email)

        const passwordHash = this.cryptPassword(password)
        await this.registerAccount({ email, name, password: passwordHash })

        return Result.success({ message: 'Conta registrada com sucesso' })
    }

    private validateDTO(args: AccountCreateDTOArgs) {
        return this.validator.performParse(args, schemaDTO).getValue()
    }

    private async validAccountEmailAlreadyExists(email: string) {
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

    private async registerAccount({ email, name, password }: AccountCreateDTOArgs) {
        const registerAccountResult = await this.repository.register({ email, name, password, balance: 0 })

        if (!registerAccountResult.isSuccess()) {
            throw new BadRequestException({
                ...registerAccountResult.getError(),
                title: 'Registrar Conta',
                message: `Não foi registrar a conta. Erro: "${registerAccountResult.getError().message}"`,
            })
        }
    }
}
