import { Result, Injection, Service } from '@core'
import { BadRequestException } from '@common/exceptions'
import { GLOBAL_DTO } from '@global'
import { isValidCnpj, isValidItin } from '@util'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { CryptoService } from '@services/crypto.service'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { GLOBAL_USER_DTO } from '@modules/user/user.global'
import { UserRepository } from '@modules/user/user.repository'
import { UserGenerateCodeUseCase } from '@modules/user/use-case/generate-code.use-case'
import { UserModel } from '@modules/user/user.model'
import { GLOBAL_PEOPLE_DTO } from '@modules/people/people.global'
import { PeopleModel } from '@modules/people/people.model'
import { PeopleCreateDTOArgs, PeopleCreateUseCase } from '@modules/people/use-case/create.use-case'

const baseSchemaDTO = ValidatorService.schema.object({
    login: ValidatorService.schema
        .string({ 'required_error': GLOBAL_USER_DTO.login.messageRequired })
        .email({ message: GLOBAL_USER_DTO.login.messageInvalid })
        .max(GLOBAL_USER_DTO.login.maxCharacters, { message: GLOBAL_USER_DTO.login.messageRangeCharacters })
        .trim(),
    password: ValidatorService.schema
        .string({ 'required_error': GLOBAL_USER_DTO.password.messageRequired })
        .trim()
        .regex(GLOBAL_USER_DTO.password.regex, { message: GLOBAL_USER_DTO.password.messageRegex }),
    userType: ValidatorService.schema
        .enum(GLOBAL_USER_DTO.type.enum, { errorMap: () => ({ message: GLOBAL_USER_DTO.type.messageEnumInvalid }) })
        .transform(val => val.toUpperCase()),
})

const schemaCreateUserOnlyDTO = baseSchemaDTO.extend({
    peopleId: GLOBAL_USER_DTO.people.id,
})

const schemaCreateUserAndPeopleDTO = baseSchemaDTO.extend({
    peopleId: GLOBAL_USER_DTO.people.id,
    peopleType: ValidatorService.schema
        .enum(GLOBAL_PEOPLE_DTO.type.enum, { errorMap: () => ({ message: GLOBAL_PEOPLE_DTO.type.messageEnumInvalid }) }),
})

export type UserCreateUserOnlyDTOArgs = SchemaValidator.input<typeof schemaCreateUserOnlyDTO>
export type UserCreateUserAndPeopleDTOArgs = SchemaValidator.input<typeof schemaCreateUserAndPeopleDTO> & Omit<PeopleCreateDTOArgs, 'type'> & { peopleType: PeopleModel.Type }

@Service({ name: 'user.use-case.create' })
export class UserCreateUseCase extends UseCase {
    constructor(
        @Injection.Inject('user.repository') private userRepository: UserRepository,
        @Injection.Inject('crypto') private crypto: CryptoService,
        @Injection.Inject('people.use-case.create') private peopleCreateUC: PeopleCreateUseCase,
        @Injection.Inject('user.use-case.generate-code') private userGenerateCodeUC: UserGenerateCodeUseCase,
    ) {
        super()
    }

    async createUserAndPeople(args: UserCreateUserAndPeopleDTOArgs) {
        const { login, password, userType } = this.validateDTO(args, baseSchemaDTO)
        const { name, itinCnpj, dateOfBirth, gender, type: peopleType } = await this.peopleCreateUC.validDTO({ ...args, type: args.peopleType })

        const { code, passwordHash } = await this.validateRegister({ login, password })
        await this.registerUserWithPeople({ login, password: passwordHash, code, type: userType as UserModel.Type, active: true }, { active: true, dateOfBirth, gender, itinCnpj, name, type: peopleType })

        return Result.success({ message: 'Register user successfully' })
    }

    async createUserByPeopleId(args: UserCreateUserOnlyDTOArgs) {
        const { login, password, peopleId, userType } = this.validateDTO(args, schemaCreateUserOnlyDTO)

        await this.validIsAlreadyHasUserTypeForPeople({ peopleId, type: userType as UserModel.Type })
        const { code, passwordHash } = await this.validateRegister({ login, password })
        await this.registerUser({ login, password: passwordHash, code, peopleId, type: userType as UserModel.Type, active: true })

        return Result.success({ message: 'Register user successfully' })
    }

    private async validateRegister({ login, password }: { login: string, password: string }) {
        await this.valUserIdLoginAlreadyExists(login)
        const passwordHash = this.cryptPassword(password)
        const code = await this.generateCode()

        return { code, passwordHash }
    }

    private async validIsAlreadyHasUserTypeForPeople({ peopleId, type }: { peopleId: ID, type: UserModel.Type }) {
        const userResult = await this.userRepository.findFirst({ where: { peopleId, type } })

        if (userResult.isSuccess()) {
            throw new BadRequestException({
                title: 'Register  User',
                message: `There is already a user of type ${type == UserModel.Type.ADMIN ? 'ADMIN' : type == UserModel.Type.CUSTOMER ? 'Customer' : ''} for this person`,
            })
        }

        if (userResult.isErrorInOperation()) {
            throw new BadRequestException({
                ...userResult.getError(),
                title: 'Register  User',
                message: 'Unable to validate whether the login already exists. Please, try again later',
            })
        }
    }

    private async valUserIdLoginAlreadyExists(login: string) {
        const userAlreadyExistsResult = await this.userRepository.findUnique({ where: { login } })

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
        const registerUserResult = await this.userRepository.create({ data: { login, password, code, people: { connect: { id: peopleId } }, type } })

        if (registerUserResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...registerUserResult.getError(),
            title: 'Register User',
        })
    }

    private async registerUserWithPeople(userData: Omit<UserModel.Model, 'peopleId'>, peopleData: PeopleModel.CreateArgs) {
        const registerUserResult = await this.userRepository.create({
            data: {
                ...userData,
                people: {
                    create: { ...peopleData }
                }
            }
        })

        if (registerUserResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...registerUserResult.getError(),
            title: 'Register User',
        })
    }
}
