import { ID, PayloadJWTCustomerBankAccount } from '@@types'
import { Hash } from '@services/hash'
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

    const user = await getUserBankAccountByLogin(userId, login)

    const { people: { bankAccounts: [bankAccount], id: peopleId } } = user

    if (!bankAccount)
        throw new BadRequestException({ title: 'Sign In', message: 'Login or password invalid' })

    const isSamePassword = await Hash.compare(password, bankAccount.password)

    if (!isSamePassword)
        throw new BadRequestException({ title: 'Sign In', message: 'Login or password invalid' })

    return { token: generateToken({ bankAccountId: bankAccount.id, peopleId, slug: bankAccount.slug, userId }) }
}

async function getUserBankAccountByLogin(userId: ID, login: string) {
    const user = await userRepository.findUnique({
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

    return user
}

function generateToken({ bankAccountId, peopleId, slug, userId }: { bankAccountId: ID, userId: ID, peopleId: ID, slug: string }) {
    const payload: PayloadJWTCustomerBankAccount = {
        id: bankAccountId,
        sub: userId,
        peopleId,
        slug: slug,
    }

    return jwtServiceBankAccount.encode(payload)
}