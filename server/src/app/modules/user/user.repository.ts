import { Service } from '@esliph/module'
import { ID } from '@@types'
import { Repository } from '@services/repository.service'
import { UserModel } from '@modules/user/user.model'
import { PeopleModel } from '@modules/people/people.model'

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

    async register({ login, password, code, peopleId, type }: UserModel.Model) {
        try {
            await this.database.instance.user.create({ data: { login, password, code, peopleId, type } })

            return this.handleResponse<{ message: string }>({ message: UserRepository.GLOBAL_MESSAGE.create.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: UserRepository.GLOBAL_MESSAGE.create.title, message: UserRepository.GLOBAL_MESSAGE.create.failed }
            })
        }
    }

    async registerWithPeople({ login, password, code, type: typeUser }: Omit<UserModel.Model, 'peopleId'>, { active, dateOfBirth, gender, itinCnpj, name, type: typePeople }: PeopleModel.CreateArgs) {
        try {
            await this.database.instance.user.create({
                data: {
                    type: typeUser,
                    login,
                    password,
                    code,
                    people: {
                        create: {
                            active,
                            dateOfBirth,
                            gender,
                            itinCnpj,
                            name,
                            type: typePeople
                        }
                    }
                }
            })

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

    async findByPeopleIdWithPeople(peopleId: ID) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { peopleId }, include: { people: true } })

            return this.handleResponse<UserModel.UserWithPeople>(user, {
                noAcceptNullable: true,
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.notFound }
            })
        } catch (err: any) {
            return this.handleError<UserModel.UserWithPeople>(err, {
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findByIdAndPeopleId(id: ID, peopleId: ID) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { id, peopleId } })

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

    async findByPeopleIdAndType(peopleId: ID, type: UserModel.Type) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { peopleId, type } })

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

    async findByLogin(login: string) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { login }, include: { people: true } })

            return this.handleResponse<UserModel.UserWithPeople>(user, {
                noAcceptNullable: true,
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.notFound }
            })
        } catch (err: any) {
            return this.handleError<UserModel.UserWithPeople>(err, {
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findByLoginAndType(login: string, type: UserModel.Type) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { login, type }, include: { people: true } })

            return this.handleResponse<UserModel.UserWithPeople>(user, {
                noAcceptNullable: true,
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.notFound }
            })
        } catch (err: any) {
            return this.handleError<UserModel.UserWithPeople>(err, {
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findByLoginOrCode(loginOrCode: string) {
        try {
            const user = await this.database.instance.user.findFirst({
                where: {
                    OR: [
                        { code: loginOrCode },
                        { login: loginOrCode }
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

    async findByIdWithoutPasswordWithPeople(id: ID) {
        try {
            const user = await this.database.instance.user.findFirst({
                where: { id },
                select: { ...UserModel.UserWithoutPasswordSelect, people: true }
            })

            return this.handleResponse<UserModel.UserWithoutPasswordWithPeople>(user, {
                noAcceptNullable: true,
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<UserModel.UserWithoutPasswordWithPeople>(err, {
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

    async findByLoginWithoutPassword(login: string) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { login }, select: UserModel.UserWithoutPasswordSelect })

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

    async findByPeopleIdAndTypeWithoutPassword(peopleId: ID, type: UserModel.Type) {
        try {
            const user = await this.database.instance.user.findFirst({
                where: { peopleId, type },
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

    async findByPeopleIdAndTypeWithPeopleWithoutPassword(peopleId: ID, type: UserModel.Type) {
        try {
            const user = await this.database.instance.user.findFirst({
                where: { peopleId, type },
                select: { ...UserModel.UserWithoutPasswordSelect, people: true }
            })

            return this.handleResponse<UserModel.UserWithoutPasswordWithPeople>(user, {
                noAcceptNullable: true,
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<UserModel.UserWithoutPasswordWithPeople>(err, {
                error: { title: UserRepository.GLOBAL_MESSAGE.find.title, message: UserRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }
}
