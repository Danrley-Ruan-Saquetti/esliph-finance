import { Service } from '@esliph/module'
import { ID } from '@@types'
import { Repository } from '@services/repository.service'
import { UserModel } from '@modules/user/user.model'

@Service({ name: 'financial-transaction.repository' })
export class FinancialTransactionRepository extends Repository {
    async register({ email, name, password, code }: UserModel.Model) {
        try {
            await this.database.instance.user.create({ data: { email, name, password, code } })

            return this.handleResponse<{ message: string }>(
                { message: 'User successfully registered' },
                { error: { title: 'Register User', message: 'User successfully registered' } },
            )
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, { error: { title: 'Register User', message: 'Unable to register user' } })
        }
    }

    async updateById(args: UserModel.Model, where: { id: number }) {
        try {
            await this.database.instance.user.update({ where: { id: where.id }, data: args })

            return this.handleResponse<{ message: string }>(
                { message: 'User successfully updated' },
                { error: { title: 'Update User', message: 'User successfully updated' } },
            )
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, { error: { title: 'Update User', message: 'Unable to update user' } })
        }
    }

    async findById(id: ID) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { id } })

            return this.handleResponse<UserModel.User>(user, { noAcceptNullable: true, error: { title: 'Find User', message: 'User not found' } })
        } catch (err: any) {
            return this.handleError<UserModel.User>(err, { error: { title: 'Find User', message: 'User not found' } })
        }
    }

    async findByCode(code: string) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { code } })

            return this.handleResponse<UserModel.User>(user, { noAcceptNullable: true, error: { title: 'Find User', message: 'User not found' } })
        } catch (err: any) {
            return this.handleError<UserModel.User>(err, { error: { title: 'Find User', message: 'User not found' } })
        }
    }

    async findByEmail(email: string) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { email } })

            return this.handleResponse<UserModel.User>(user, { noAcceptNullable: true, error: { title: 'Find User', message: 'User not found' } })
        } catch (err: any) {
            return this.handleError<UserModel.User>(err, { error: { title: 'Find User', message: 'User not found' } })
        }
    }

    async findByIdWithoutPassword(id: ID) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { id }, select: UserModel.UserWithoutPasswordSelect })

            return this.handleResponse<UserModel.UserWithoutPassword>(user, {
                noAcceptNullable: true,
                error: { title: 'Find User', message: 'User not found' },
            })
        } catch (err: any) {
            return this.handleError<UserModel.UserWithoutPassword>(err, { error: { title: 'Find User', message: 'User not found' } })
        }
    }

    async findByCodeWithoutPassword(code: string) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { code }, select: UserModel.UserWithoutPasswordSelect })

            return this.handleResponse<UserModel.UserWithoutPassword>(user, {
                noAcceptNullable: true,
                error: { title: 'Find User', message: 'User not found' },
            })
        } catch (err: any) {
            return this.handleError<UserModel.UserWithoutPassword>(err, { error: { title: 'Find User', message: 'User not found' } })
        }
    }

    async findByEmailWithoutPassword(email: string) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { email }, select: UserModel.UserWithoutPasswordSelect })

            return this.handleResponse<UserModel.UserWithoutPassword>(user, {
                noAcceptNullable: true,
                error: { title: 'Find User', message: 'User not found' },
            })
        } catch (err: any) {
            return this.handleError<UserModel.UserWithoutPassword>(err, { error: { title: 'Find User', message: 'User not found' } })
        }
    }
}
