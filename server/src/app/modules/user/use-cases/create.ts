import bcrypt from 'bcrypt'
import { toCapitalise } from '@util/geral'
import { Transaction } from '@services/database'
import { z, Validator } from '@services/validator'
import { BadRequestException } from '@exceptions/bad-request'
import { UserModel } from '@modules/user/model'
import { PeopleModel } from '@modules/people/model'
import { generateCode } from '@modules/user/use-cases/generate-code'
import { GLOBAL_USER_DTO } from '@modules/user/global'
import { GLOBAL_PEOPLE_DTO } from '@modules/people/global'
import type { PeopleCreateDTOArgs } from '@modules/people/use-cases/create'
import { validCreate as validCreatePeople } from '@modules/people/use-cases/create'

const { userRepository } = UserModel
const { peopleRepository } = PeopleModel

const schemaCreateUserBase = z.object({
    login: z
        .string({ 'required_error': GLOBAL_USER_DTO.login.messageRequired })
        .email({ message: GLOBAL_USER_DTO.login.messageInvalid })
        .max(GLOBAL_USER_DTO.login.maxCharacters, { message: GLOBAL_USER_DTO.login.messageRangeCharacters })
        .trim(),
    password: z
        .string({ 'required_error': GLOBAL_USER_DTO.password.messageRequired })
        .trim()
        .regex(GLOBAL_USER_DTO.password.regex, { message: GLOBAL_USER_DTO.password.messageRegex }),
    userType: z
        .enum(GLOBAL_USER_DTO.type.enum, { errorMap: () => ({ message: GLOBAL_USER_DTO.type.messageEnumInvalid }) })
        .transform(val => val.toUpperCase()),
})

const schemaCreateUserOnlyDTO = schemaCreateUserBase.extend({
    peopleId: GLOBAL_USER_DTO.people.id,
})

const schemaCreateUserAndPeopleDTO = schemaCreateUserBase.extend({
    peopleType: z
        .enum(GLOBAL_PEOPLE_DTO.type.enum, { errorMap: () => ({ message: GLOBAL_PEOPLE_DTO.type.messageEnumInvalid }) }),
})

export type UserCreateUserOnlyDTOArgs = z.input<typeof schemaCreateUserOnlyDTO>
export type UserCreateUserAndPeopleDTOArgs = z.input<typeof schemaCreateUserAndPeopleDTO> & Omit<PeopleCreateDTOArgs, 'type'>

export async function createWithPeople(args: UserCreateUserAndPeopleDTOArgs) {
    const { dateOfBirth, gender, itinCnpj, name, type: peopleType } = await validCreatePeople({ ...args, type: args.peopleType })

    const transaction = await Transaction.begin()
    try {
        const peopleCreate = await peopleRepository.create({
            data: {
                dateOfBirth,
                gender,
                itinCnpj,
                name,
                type: peopleType
            }
        })

        const createUser = await create({ ...args, peopleId: peopleCreate.id })

        await transaction.commit()

        return createUser
    } catch (err) {
        await transaction.rollback()
        throw err
    }
}

export async function create(args: UserCreateUserOnlyDTOArgs) {
    const { peopleId, login, password, userType } = await validCreate(args)

    const passwordHashed = bcrypt.hashSync(password, 5)
    const { code } = await generateCode()

    await userRepository.create({
        data: {
            peopleId,
            code,
            login,
            password: passwordHashed,
            type: userType as UserModel.Type,
        }
    })

    return { message: `${toCapitalise(userType.toLowerCase())} registered successfully` }
}

export async function validCreate(args: UserCreateUserOnlyDTOArgs) {
    const { peopleId, login, password, userType } = Validator.parseFilterNoSafe(args, schemaCreateUserOnlyDTO)

    await peopleRepository.checkExistsOrTrow({ where: { id: peopleId } })

    const isExistsUserSameType = await userRepository.findFirst({
        where: {
            OR: [
                { peopleId, type: userType as UserModel.Type },
                { login, type: userType as UserModel.Type },
            ]
        }
    })

    if (isExistsUserSameType) {
        if (isExistsUserSameType.login == login)
            throw new BadRequestException({ title: `Validate login ${userType.toLowerCase()}`, message: `There is already another ${userType.toLowerCase()} with this login registered` })

        throw new BadRequestException({ title: `Find another ${userType.toLowerCase()}`, message: `There is already a registered ${userType.toLowerCase()} for this people` })
    }

    return { peopleId, login, password, userType }
}