import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { BadRequestException } from '@common/exceptions'
import { UseCase } from '@common/use-case'
import { CryptoService } from '@services/crypto.service'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { GLOBAL_USER_DTO } from '@modules/user/user.global'
import { UserRepository } from '@modules/user/user.repository'

const schemaDTO = ValidatorService.schema.object({
    name: ValidatorService.schema
        .string()
        .trim()
        .min(1, { message: GLOBAL_USER_DTO.name.messageRequired })
        .min(GLOBAL_USER_DTO.name.minCharacters, { message: GLOBAL_USER_DTO.name.messageMinCharacters })
        .transform(val => val.replace(/ {2}/g, ' ')),
    email: ValidatorService.schema.string().trim().email({ message: GLOBAL_USER_DTO.email.messageInvalid }).trim().min(1, { message: GLOBAL_USER_DTO.email.messageRequired }),
    password: ValidatorService.schema.string().trim().min(1, { message: GLOBAL_USER_DTO.password.messageRequired }),
})

export type UserCreateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'user.use-case.create' })
export class UserCreateUseCase extends UseCase {
    constructor(
        @Injection.Inject('user.repository') private repository: UserRepository,
        @Injection.Inject('crypto') private crypto: CryptoService,
    ) {
        super()
    }

    async perform(args: UserCreateDTOArgs) {
        const { email, name, password } = this.validateDTO(args, schemaDTO)

        await this.validUserEmailAlreadyExists(email)

        const passwordHash = this.cryptPassword(password)
        await this.registerUser({ email, name, password: passwordHash })

        return Result.success({ message: 'Register user successfully' })
    }

    private async validUserEmailAlreadyExists(email: string) {
        const userAlreadyExistsResult = await this.repository.findByEmail(email)

        if (userAlreadyExistsResult.isSuccess()) {
            throw new BadRequestException({
                title: 'Register  User',
                message: 'E-mail is already in use',
            })
        }

        if (userAlreadyExistsResult.isErrorInOperation()) {
            throw new BadRequestException({
                title: 'Register  User',
                message: 'Unable to validate whether the e-mail already exists. Please, try again later',
            })
        }
    }

    private cryptPassword(password: string) {
        return this.crypto.bcrypto.hashSync(password, 5)
    }

    private async registerUser({ email, name, password }: UserCreateDTOArgs) {
        const registerUserResult = await this.repository.register({ email, name, password })

        if (registerUserResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...registerUserResult.getError(),
            title: 'Register User',
            message: `Unable to register user. Error: "${registerUserResult.getError().message}". Please, try again later`,
        })
    }
}
