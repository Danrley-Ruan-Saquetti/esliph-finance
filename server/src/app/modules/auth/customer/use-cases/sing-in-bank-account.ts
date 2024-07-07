import bcrypt from 'bcrypt'
import { PayloadJWTCustomerBankAccount } from '@@types'
import { z, Validator } from '@services/validator'
import { BadRequestException } from '@exceptions/bad-request'
import { UserModel } from '@modules/user/model'
import { GLOBAL_AUTH_DTO } from '@modules/auth/global'
import { jwtServiceBankAccount } from '@modules/auth/customer/global'
import { GLOBAL_BANK_ACCOUNT_DTO } from '@modules/bank-account/global'

const { userRepository } = UserModel

const schemaSignIn = z.object({
    userId: GLOBAL_BANK_ACCOUNT_DTO.user.id,
    login: z
        .string({ 'required_error': GLOBAL_AUTH_DTO.login.messageRequired })
        .trim(),
    password: z
        .string({ 'required_error': GLOBAL_BANK_ACCOUNT_DTO.password.messageRequired })
        .trim(),
})

export type SignInDTOArgs = z.input<typeof schemaSignIn>

export async function singIn(args: SignInDTOArgs) {
    const { login, password, userId } = Validator.parseNoSafe(args, schemaSignIn)

    const user = await userRepository.findFirstOrThrow({
        where: {
            id: userId,
            type: UserModel.Type.CUSTOMER,
        },
        select: {
            people: {
                select: {
                    id: true,
                    bankAccounts: {
                        where: {
                            active: true,
                            OR: [
                                { code: login },
                                { slug: login },
                            ]
                        },
                        select: { id: true, password: true, slug: true, },
                        take: 1
                    }
                }
            }
        }
    })

    if (!user)
        throw new BadRequestException({ title: 'Sign In', message: 'Login or password invalid' })

    const { people: { bankAccounts: [bankAccount], id: peopleId } } = user

    if (!bankAccount)
        throw new BadRequestException({ title: 'Sign In', message: 'Login or password invalid' })

    const isSamePassword = await bcrypt.compare(password, bankAccount.password)

    if (!isSamePassword)
        throw new BadRequestException({ title: 'Sign In', message: 'Login or password invalid' })

    const payload: PayloadJWTCustomerBankAccount = {
        id: bankAccount.id,
        sub: userId,
        peopleId,
        slug: bankAccount.slug,
    }

    return { token: jwtServiceBankAccount.encode(payload) }
}