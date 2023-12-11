import { Result } from '@esliph/common'
import { Service } from '@esliph/module'
import { ID } from '@@types'
import { Repository } from '@common/repository'
import { UserModel } from '@modules/user/user.model'

@Service({ name: 'user.repository' })
export class UserRepository extends Repository {
    async register({ email, name, password }: UserModel.Model) {
        try {
            await this.database.instance.user.create({ data: { email, name, password } })

            return this.performResponse(Result.success({ ok: true }))
        } catch (err: any) {
            return this.performError<Result<{ ok: boolean }>>(err, { error: { title: 'Register User', message: 'Cannot register user' } })
        }
    }

    async updateById(args: UserModel.Model, where: { id: number }) {
        try {
            await this.database.instance.user.update({ where: { id: where.id }, data: args })

            return this.performResponse(Result.success({ ok: true }))
        } catch (err: any) {
            return this.performError<Result<{ ok: boolean }>>(err, { error: { title: 'Update User', message: 'Cannot update user' } })
        }
    }

    async findById(id: ID) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { id } })

            if (!user) {
                return this.performResponse(Result.failure<UserModel.User>({ title: 'Find User', message: 'User not found' }))
            }

            return this.performResponse(Result.success<UserModel.User>(user))
        } catch (err: any) {
            return this.performError<Result<UserModel.User>>(err, { noThrow: true, error: { title: 'Find User', message: 'User not found' } })
        }
    }

    async findByEmail(email: string) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { email } })

            if (!user) {
                return this.performResponse(Result.failure<UserModel.User>({ title: 'Find User', message: 'User not found' }))
            }

            return this.performResponse(Result.success<UserModel.User>(user))
        } catch (err: any) {
            return this.performError<Result<UserModel.User>>(err, { noThrow: true, error: { title: 'Find User', message: 'User not found' } })
        }
    }

    async findByIdWithoutPassword(id: ID) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { id }, select: UserModel.UserWithoutPasswordSelect })

            if (!user) {
                return this.performResponse(Result.failure<UserModel.UserWithoutPassword>({ title: 'Find User', message: 'User not found' }))
            }

            return this.performResponse(Result.success<UserModel.UserWithoutPassword>(user))
        } catch (err: any) {
            return this.performError<Result<UserModel.UserWithoutPassword>>(err, { noThrow: true, error: { title: 'Find User', message: 'User not found' } })
        }
    }

    async findByEmailWithoutPassword(email: string) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { email }, select: UserModel.UserWithoutPasswordSelect })

            if (!user) {
                return this.performResponse(Result.failure<UserModel.UserWithoutPassword>({ title: 'Find User', message: 'User not found' }))
            }

            return this.performResponse(Result.success<UserModel.UserWithoutPassword>(user))
        } catch (err: any) {
            return this.performError<Result<UserModel.UserWithoutPassword>>(err, { noThrow: true, error: { title: 'Find User', message: 'User not found' } })
        }
    }
}
