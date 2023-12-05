import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { BadRequestException } from '@common/exceptions'
import { CryptoService } from '@services/crypto.service'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { UserRepository } from '@modules/user/user.repository'

const schemaDTO = ValidatorService.schema.object({
    name: ValidatorService.schema
        .string()
        .trim()
        .min(1, { message: 'Name is required' })
        .transform(val => val.replace(/ {2}/g, ' ')),
    email: ValidatorService.schema.string().email({ message: 'E-mail invalid' }).trim().min(1, { message: 'E-mail is required' }),
    password: ValidatorService.schema.string().trim().min(1, { message: 'Password is required' }),
})

export type UserCreateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'user.use-case.create' })
export class UserCreateUseCase {
    constructor(
        @Injection.Inject('user.repository') private repository: UserRepository,
        @Injection.Inject('crypto') private crypto: CryptoService,
        @Injection.Inject('validator') private validator: ValidatorService,
    ) {}

    async perform(args: UserCreateDTOArgs) {
        const { email, name, password } = this.validateDTO(args)

        await this.validUserEmailAlreadyExists(email)

        const passwordHash = this.cryptPassword(password)
        await this.registerUser({ email, name, password: passwordHash })

        return Result.success({ message: 'Conta registrada com sucesso' })
    }

    private validateDTO(args: UserCreateDTOArgs) {
        return this.validator.performParse(args, schemaDTO).getValue()
    }

    private async validUserEmailAlreadyExists(email: string) {
        const userAlreadyExistsByEmailResult = await this.repository.findByEmail(email)

        if (userAlreadyExistsByEmailResult.isSuccess()) {
            throw new BadRequestException({
                ...userAlreadyExistsByEmailResult.getError(),
                title: 'Register User',
                message: 'E-mail is already in use',
            })
        }
    }

    private cryptPassword(password: string) {
        return this.crypto.bcrypto
    }

    private async registerUser({ email, name, password }: UserCreateDTOArgs) {
        const registerUserResult = await this.repository.register({ email, name, password, balance: 0 })

        if (!registerUserResult.isSuccess()) {
            throw new BadRequestException({
                ...registerUserResult.getError(),
                title: 'Registrar Conta',
                message: `Não foi registrar a conta. Erro: "${registerUserResult.getError().message}"`,
            })
        }
    }
}
