import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
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

const baseSchemaDTO = ValidatorService.schema.object({
    name: ValidatorService.schema
        .string({ 'required_error': GLOBAL_PEOPLE_DTO.name.messageRequired })
        .trim()
        .min(GLOBAL_PEOPLE_DTO.name.minCharacters, { message: GLOBAL_PEOPLE_DTO.name.messageRangeCharacters })
        .max(GLOBAL_PEOPLE_DTO.name.maxCharacters, { message: GLOBAL_PEOPLE_DTO.name.messageRangeCharacters })
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
    userType: ValidatorService.schema
        .enum(GLOBAL_USER_DTO.type.enum, { errorMap: () => ({ message: GLOBAL_USER_DTO.type.messageEnumInvalid }) })
        .transform(val => val.toUpperCase()),
})

const schemaCreateUserOnlyDTO = baseSchemaDTO.extend({
    peopleId: GLOBAL_USER_DTO.people.id,
})

const schemaCreateUserAndPeopleDTO = baseSchemaDTO.extend({
    itinCnpj: ValidatorService.schema
        .string({ 'required_error': GLOBAL_PEOPLE_DTO.itin.messageRequired })
        .trim(),
    peopleType: ValidatorService.schema
        .enum(GLOBAL_PEOPLE_DTO.type.enum, { errorMap: () => ({ message: GLOBAL_PEOPLE_DTO.type.messageEnumInvalid }) }),
    gender: ValidatorService.schema
        .enum(GLOBAL_PEOPLE_DTO.gender.enum, { errorMap: () => ({ message: GLOBAL_PEOPLE_DTO.gender.messageEnumInvalid }) })
        .optional(),
    dateOfBirth: GLOBAL_DTO.date.schema
        .optional()
        .refine(date => !date || date < new Date(Date.now()))
        .transform(date => date || undefined),
})
    .refine(({ peopleType, itinCnpj: itin }) => peopleType !== PeopleModel.Type.NATURAL_PERSON || isValidItin(itin), { message: GLOBAL_PEOPLE_DTO.itin.messageInvalid })
    .refine(({ peopleType, itinCnpj: cnpj }) => peopleType !== PeopleModel.Type.LEGAL_ENTITY || isValidCnpj(cnpj), { message: GLOBAL_PEOPLE_DTO.cnpj.messageInvalid })

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

    async createUserAndPeople(args: UserCreateUserAndPeopleDTOArgs) {
        const { login, password, peopleType, name, itinCnpj, dateOfBirth, gender, userType } = this.validateDTO(args, schemaCreateUserAndPeopleDTO)

        const { code, passwordHash } = await this.validateRegister({ login, password })
        await this.registerUserWithPeople({ login, password: passwordHash, code, type: userType as UserModel.Type }, { active: true, dateOfBirth, gender, itinCnpj, name, type: peopleType })

        return Result.success({ message: 'Register user successfully' })
    }

    async createUserByPeopleId(args: UserCreateUserOnlyDTOArgs) {
        const { login, password, peopleId, userType } = this.validateDTO(args, schemaCreateUserOnlyDTO)

        await this.validIsAlreadyHasUserTypeForPeople({ peopleId, type: userType as UserModel.Type })
        const { code, passwordHash } = await this.validateRegister({ login, password })
        await this.registerUser({ login, password: passwordHash, code, peopleId, type: userType as UserModel.Type })

        return Result.success({ message: 'Register user successfully' })
    }

    private async validateRegister({ login, password }: { login: string, password: string }) {
        await this.valUserIdLoginAlreadyExists(login)
        const passwordHash = this.cryptPassword(password)
        const code = await this.generateCode()

        return { code, passwordHash }
    }

    private async validIsAlreadyHasUserTypeForPeople({ peopleId, type }: { peopleId: ID, type: UserModel.Type }) {
        const userResult = await this.userRepository.findByPeopleIdAndType(peopleId, type)

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

    private async registerUserWithPeople(userData: Omit<UserModel.Model, 'peopleId'>, peopleData: PeopleModel.CreateArgs) {
        const registerUserResult = await this.userRepository.registerWithPeople(userData, peopleData)

        if (registerUserResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...registerUserResult.getError(),
            title: 'Register User',
        })
    }
}
