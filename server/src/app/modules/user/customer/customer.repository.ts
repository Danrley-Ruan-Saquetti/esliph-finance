import { Service } from '@core'
import { ID } from '@@types'
import { Repository } from '@services/repository.service'
import { UserModel } from '@modules/user/user.model'

@Service({ name: 'customer.repository' })
export class CustomerRepository extends Repository {
    private static GLOBAL_MESSAGE = {
        find: {
            title: 'Find Customer',
            notFound: 'Customer not found',
            failed: 'Unable to query customer'
        }
    }

    async findById(id: ID) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { id, type: UserModel.Type.CUSTOMER } })

            return this.handleResponse<UserModel.User>(user, {
                noAcceptNullable: true,
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.notFound }
            })
        } catch (err: any) {
            return this.handleError<UserModel.User>(err, {
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findByPeopleIdWithPeople(peopleId: ID) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { peopleId, type: UserModel.Type.CUSTOMER }, include: { people: true } })

            return this.handleResponse<UserModel.UserWithPeople>(user, {
                noAcceptNullable: true,
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.notFound }
            })
        } catch (err: any) {
            return this.handleError<UserModel.UserWithPeople>(err, {
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findByIdAndPeopleId(id: ID, peopleId: ID) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { id, peopleId, type: UserModel.Type.CUSTOMER } })

            return this.handleResponse<UserModel.User>(user, {
                noAcceptNullable: true,
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.notFound }
            })
        } catch (err: any) {
            return this.handleError<UserModel.User>(err, {
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findByCode(code: string) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { code, type: UserModel.Type.CUSTOMER } })

            return this.handleResponse<UserModel.User>(user, {
                noAcceptNullable: true,
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.notFound }
            })
        } catch (err: any) {
            return this.handleError<UserModel.User>(err, {
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findByLogin(login: string) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { login, type: UserModel.Type.CUSTOMER }, include: { people: true } })

            return this.handleResponse<UserModel.UserWithPeople>(user, {
                noAcceptNullable: true,
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.notFound }
            })
        } catch (err: any) {
            return this.handleError<UserModel.UserWithPeople>(err, {
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.failed }
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
                    ],
                    type: UserModel.Type.CUSTOMER
                }
            })

            return this.handleResponse<UserModel.User>(user, {
                noAcceptNullable: true,
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.notFound }
            })
        } catch (err: any) {
            return this.handleError<UserModel.User>(err, {
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findByIdWithoutPassword(id: ID) {
        try {
            const user = await this.database.instance.user.findFirst({
                where: { id, type: UserModel.Type.CUSTOMER },
                select: UserModel.UserWithoutPasswordSelect
            })

            return this.handleResponse<UserModel.UserWithoutPassword>(user, {
                noAcceptNullable: true,
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<UserModel.UserWithoutPassword>(err, {
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findByIdWithoutPasswordWithPeople(id: ID) {
        try {
            const user = await this.database.instance.user.findFirst({
                where: { id, type: UserModel.Type.CUSTOMER },
                select: { ...UserModel.UserWithoutPasswordSelect, people: true }
            })

            return this.handleResponse<UserModel.UserWithoutPasswordWithPeople>(user, {
                noAcceptNullable: true,
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<UserModel.UserWithoutPasswordWithPeople>(err, {
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findByCodeWithoutPassword(code: string) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { code, type: UserModel.Type.CUSTOMER }, select: UserModel.UserWithoutPasswordSelect })

            return this.handleResponse<UserModel.UserWithoutPassword>(user, {
                noAcceptNullable: true,
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<UserModel.UserWithoutPassword>(err, {
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findByLoginWithoutPassword(login: string) {
        try {
            const user = await this.database.instance.user.findFirst({ where: { login, type: UserModel.Type.CUSTOMER }, select: UserModel.UserWithoutPasswordSelect })

            return this.handleResponse<UserModel.UserWithoutPassword>(user, {
                noAcceptNullable: true,
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<UserModel.UserWithoutPassword>(err, {
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }
}
