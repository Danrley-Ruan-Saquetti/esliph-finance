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
import { UserModel } from '../user.model'

const baseSchemaDTO = ValidatorService.schema.object({
    name: ValidatorService.schema
        .string({ 'required_error': GLOBAL_USER_DTO.name.messageRequired })
        .trim()
        .min(GLOBAL_USER_DTO.name.minCharacters, { message: GLOBAL_USER_DTO.name.messageRangeCharacters })
        .max(GLOBAL_USER_DTO.name.maxCharacters, { message: GLOBAL_USER_DTO.name.messageRangeCharacters })
        .transform(GLOBAL_DTO.text.transform),
    login: ValidatorService.schema
        .string({ 'required_error': GLOBAL_USER_DTO.login.messageRequired })
        .email({ message: GLOBAL_USER_DTO.login.messageInvalid })
        .max(GLOBAL_USER_DTO.login.maxCharacters, { message: GLOBAL_USER_DTO.login.messageRangeCharacters })
        .trim(),
    password: ValidatorService.schema
        .string({ 'required_error': GLOBAL_USER_DTO.password.messageRequired })
        .trim()
        .regex(GLOBAL_USER_DTO.password.regex, { message: GLOBAL_USER_DTO.password.messageRegex }),
    type: ValidatorService.schema
        .enum(GLOBAL_USER_DTO.type.enum, { errorMap: () => ({ message: GLOBAL_USER_DTO.type.messageEnumInvalid }) })
        .transform(val => val.toUpperCase()),
})

const schemaCreateUserOnlyDTO = baseSchemaDTO.extend({
    peopleId: GLOBAL_USER_DTO.people.id,
})

const schemaCreateUserAndPeopleDTO = baseSchemaDTO.extend({

})

export type UserCreateUserOnlyDTOArgs = SchemaValidator.input<typeof schemaCreateUserOnlyDTO>
export type UserCreateUserAndPeopleDTOArgs = SchemaValidator.input<typeof schemaCreateUserAndPeopleDTO>

@Service({ name: 'user.use-case.create' })
export class UserCreateUseCase extends UseCase {
    constructor(
        @Injection.Inject('user.repository') private userRepository: UserRepository,
        @Injection.Inject('crypto') private crypto: CryptoService,
        @Injection.Inject('user.use-case.generate-code') private userGenerateCodeUC: UserGenerateCodeUseCase,
    ) {
        super()
    }

    async createUserByPeopleId(args: UserCreateUserOnlyDTOArgs) {
        const { login, password, peopleId, type } = this.validateDTO(args, schemaCreateUserOnlyDTO)

        await this.validUserLoginAlreadyExists(login)

        const passwordHash = this.cryptPassword(password)
        const code = await this.generateCode()
        await this.registerUser({ login, password: passwordHash, code, peopleId, type: type as UserModel.Type })

        return Result.success({ message: 'Register user successfully' })
    }

    private async validUserLoginAlreadyExists(login: string) {
        const userAlreadyExistsResult = await this.userRepository.findByLogin(login)

        if (userAlreadyExistsResult.isSuccess()) {
            throw new BadRequestException({
                title: 'Register  User',
                message: 'Login is already in use. Please, inform another login',
            })
        }

        if (userAlreadyExistsResult.isErrorInOperation()) {
            throw new BadRequestException({
                ...userAlreadyExistsResult.getError(),
                title: 'Register  User',
                message: 'Unable to validate whether the login already exists. Please, try again later',
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

    private async registerUser({ login, password, code, peopleId, type }: UserModel.Model) {
        const registerUserResult = await this.userRepository.register({ login, password, code, peopleId, type })

        if (registerUserResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...registerUserResult.getError(),
            title: 'Register User',
        })
    }
}
