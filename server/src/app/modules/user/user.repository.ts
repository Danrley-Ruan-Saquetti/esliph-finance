import { Service } from '@esliph/module'
import { ID } from '@@types'
import { Repository } from '@services/repository.service'
import { UserModel } from '@modules/user/user.model'

@Service({ name: 'user.repository' })
export class UserRepository extends Repository {
    private static GLOBAL_MESSAGE = {
        create: {
            title: 'Register User',
            success: 'User successfully registered',
            failed: 'Failed to register user'
        },
        update: {
            title: 'Update User',
            success: 'User successfully updated',
            failed: 'Failed to update user data'
        },
        find: {
            title: 'Find User',
            notFound: 'User not found',
            failed: 'Unable to query user'
        }
    }

    async register({ email, name, password, code }: UserModel.Model) {
        try {
            await this.database.instance.user.create({ data: { email, name, password, code } })

            return this.handleResponse<{ message: string }>({ message: UserRepository.GLOBAL_MESSAGE.create.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: UserRepository.GLOBAL_MESSAGE.create.title, message: UserRepository.GLOBAL_MESSAGE.create.failed }
            })
        }
    }

    async updateById(args: UserModel.UpdateArgs, where: { id: number }) {
        try {
            await this.database.instance.user.update({
                where: { id: where.id },
                data: args
            })

            return this.handleResponse<{ message: string }>({ message: UserRepository.GLOBAL_MESSAGE.update.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: UserRepository.GLOBAL_MESSAGE.update.title, message: UserRepository.GLOBAL_MESSAGE.update.failed }
            })
        }
    }

    async findById(id: ID) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { id } })

            return this.handleResponse<UserModel.User>(user, {
                noAcceptNullable: true,
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.notFound }
            })
        } catch (err: any) {
            return this.handleError<UserModel.User>(err, {
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findByCode(code: string) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { code } })

            return this.handleResponse<UserModel.User>(user, {
                noAcceptNullable: true,
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.notFound }
            })
        } catch (err: any) {
            return this.handleError<UserModel.User>(err, {
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findByEmail(email: string) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { email } })

            return this.handleResponse<UserModel.User>(user, {
                noAcceptNullable: true,
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.notFound }
            })
        } catch (err: any) {
            return this.handleError<UserModel.User>(err, {
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findByEmailOrCode(emailOrCode: string) {
        try {
            const user = await this.database.instance.user.findFirst({
                where: {
                    OR: [
                        { code: emailOrCode },
                        { email: emailOrCode }
                    ]
                }
            })

            return this.handleResponse<UserModel.User>(user, {
                noAcceptNullable: true,
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.notFound }
            })
        } catch (err: any) {
            return this.handleError<UserModel.User>(err, {
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findByIdWithoutPassword(id: ID) {
        try {
            const user = await this.database.instance.user.findFirst({
                where: { id },
                select: UserModel.UserWithoutPasswordSelect
            })

            return this.handleResponse<UserModel.UserWithoutPassword>(user, {
                noAcceptNullable: true,
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<UserModel.UserWithoutPassword>(err, {
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findByCodeWithoutPassword(code: string) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { code }, select: UserModel.UserWithoutPasswordSelect })

            return this.handleResponse<UserModel.UserWithoutPassword>(user, {
                noAcceptNullable: true,
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<UserModel.UserWithoutPassword>(err, {
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findByEmailWithoutPassword(email: string) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { email }, select: UserModel.UserWithoutPasswordSelect })

            return this.handleResponse<UserModel.UserWithoutPassword>(user, {
                noAcceptNullable: true,
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<UserModel.UserWithoutPassword>(err, {
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }
}
