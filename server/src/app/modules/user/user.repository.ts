import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { ID } from '@@types'
import { DatabaseService, RepositoryQuery } from '@services/database.service'
import { UserModel } from '@modules/user/user.model'

@Service({ name: 'user.repository' })
export class UserRepository {
    constructor(@Injection.Inject('database') private database: DatabaseService) {}

    @RepositoryQuery({ error: { title: 'Register User', message: 'Cannot register user' } })
    async register({ email, name, password }: UserModel.Model) {
        await this.database.instance.user.create({ data: { email, name, password } })

        return Result.success({ ok: true })
    }

    @RepositoryQuery({ error: { title: 'Update User', message: 'Cannot update user' } })
    async updateById(args: UserModel.Model, where: { id: number }) {
        await this.database.instance.user.update({ where: { id: where.id }, data: args })

        return Result.success({ ok: true })
    }

    @RepositoryQuery({ noThrow: true, error: { title: 'Find User', message: 'User not found' } })
    async findById(id: ID) {
        const user = await this.database.instance.user.findFirst({ where: { id } })

        if (!user) {
            return Result.failure<UserModel.User>({ title: 'Find User', message: 'User not found' })
        }

        return Result.success<UserModel.User>(user)
    }

    @RepositoryQuery({ noThrow: true, error: { title: 'Find User', message: 'User not found' } })
    async findByEmail(email: string) {
        const user = await this.database.instance.user.findFirst({ where: { email } })

        if (!user) {
            return Result.failure<UserModel.User>({ title: 'Find User', message: 'User not found' })
        }

        return Result.success<UserModel.User>(user)
    }

    @RepositoryQuery({ noThrow: true, error: { title: 'Find User', message: 'User not found' } })
    async findByIdWithoutPassword(id: ID) {
        const user = await this.database.instance.user.findFirst({ where: { id }, select: UserModel.UserWithoutPasswordSelect })

        if (!user) {
            return Result.failure<UserModel.UserWithoutPassword>({ title: 'Find User', message: 'User not found' })
        }

        return Result.success<UserModel.UserWithoutPassword>(user)
    }

    @RepositoryQuery({ noThrow: true, error: { title: 'Find User', message: 'User not found' } })
    async findByEmailWithoutPassword(email: string) {
        const user = await this.database.instance.user.findFirst({ where: { email }, select: UserModel.UserWithoutPasswordSelect })

        if (!user) {
            return Result.failure<UserModel.UserWithoutPassword>({ title: 'Find User', message: 'User not found' })
        }

        return Result.success<UserModel.UserWithoutPassword>(user)
    }
}
