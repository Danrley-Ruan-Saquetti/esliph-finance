import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { BadRequestException } from '@common/exceptions'
import { GLOBAL_DTO } from '@global'
import { UseCase } from '@common/use-case'
import { CryptoService } from '@services/crypto.service'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { GLOBAL_USER_DTO } from '@modules/user/user.global'
import { UserRepository } from '@modules/user/user.repository'
import { UserGenerateCodeUseCase } from '@modules/user/use-case/generate-code.use-case'

const schemaDTO = ValidatorService.schema.object({
    name: ValidatorService.schema
        .string({ 'required_error': GLOBAL_USER_DTO.name.messageRequired })
        .trim()
        .min(GLOBAL_USER_DTO.name.minCharacters, { message: GLOBAL_USER_DTO.name.messageMinCharacters })
        .transform(GLOBAL_DTO.text.transform),
    email: ValidatorService.schema
        .string({ 'required_error': GLOBAL_USER_DTO.email.messageRequired })
        .email({ message: GLOBAL_USER_DTO.email.messageInvalid })
        .trim(),
    password: ValidatorService.schema
        .string({ 'required_error': GLOBAL_USER_DTO.password.messageRequired })
        .trim()
        .regex(GLOBAL_USER_DTO.password.regex, { message: GLOBAL_USER_DTO.password.messageRegex }),
})

export type UserCreateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'user.use-case.create' })
export class UserCreateUseCase extends UseCase {
    constructor(
        @Injection.Inject('user.repository') private repository: UserRepository,
        @Injection.Inject('crypto') private crypto: CryptoService,
        @Injection.Inject('user.use-case.generate-code') private userGenerateCodeUC: UserGenerateCodeUseCase,
    ) {
        super()
    }

    async perform(args: UserCreateDTOArgs) {
        const { email, name, password } = this.validateDTO(args, schemaDTO)

        await this.validUserEmailAlreadyExists(email)

        const passwordHash = this.cryptPassword(password)
        const code = await this.generateCode()
        await this.registerUser({ email, name, password: passwordHash, code })

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

    private async generateCode() {
        const codeResult = await this.userGenerateCodeUC.perform()

        if (!codeResult.isSuccess()) {
            throw new BadRequestException({
                ...codeResult.getError(),
                title: 'Register User',
            })
        }

        return codeResult.getValue().code
    }

    private async registerUser({ email, name, password, code }: UserCreateDTOArgs & { code: string }) {
        const registerUserResult = await this.repository.register({ email, name, password, code })

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
