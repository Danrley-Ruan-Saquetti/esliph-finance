import { Hash } from '@services/hash'
import { z, Validator } from '@services/validator'
import { UserModel } from '@modules/user/model'
import { GLOBAL_AUTH_DTO } from '@modules/auth/global'
import { GLOBAL_USER_DTO } from '@modules/user/global'
import { jwtServiceCustomer } from '@modules/auth/customer/global'
import { BadRequestException } from '@exceptions/bad-request'

const { userRepository } = UserModel

const schemaSignIn = z.object({
    login: z
        .string({ 'required_error': GLOBAL_AUTH_DTO.login.messageRequired })
        .trim(),
    password: z
        .string({ 'required_error': GLOBAL_USER_DTO.password.messageRequired })
        .trim(),
    type: z
        .enum(GLOBAL_USER_DTO.type.enum, { errorMap: () => ({ message: GLOBAL_USER_DTO.type.messageEnumInvalid }) })
        .transform(val => val.toUpperCase()),
})

export type SignInDTOArgs = z.input<typeof schemaSignIn>

export async function singIn(args: SignInDTOArgs) {
    const { login, password, type } = Validator.parseNoSafe(args, schemaSignIn)

    const user = await userRepository.findFirst({
        where: {
            active: true,
            type: type as UserModel.Type,
            OR: [
                { login },
                { code: login },
                { people: { itinCnpj: login } },
            ]
        },
        select: {
            id: true,
            password: true,
            code: true,
            people: { select: { id: true, } }
        }
    })

    if (!user)
        throw new BadRequestException({ title: 'Sign In', message: 'Login or password invalid' })

    const isSamePassword = await Hash.compare(password, user.password)

    if (!isSamePassword)
        throw new BadRequestException({ title: 'Sign In', message: 'Login or password invalid' })

    await userRepository.update({
        data: { lastAcess: new Date(Date.now()) },
        where: { id: user.id }
    })

    return { token: jwtServiceCustomer.encode({ sub: user.id, peopleId: user.people.id, }) }
}