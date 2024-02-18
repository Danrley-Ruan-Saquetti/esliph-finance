import { Prisma } from '@services/database.service'
import { Service } from '@core'
import { Repository } from '@services/repository.service'
import { UserModel } from '@modules/user/user.model'

type CustomerGetPayloadTypes = boolean | null | undefined | { select?: Prisma.UserSelect | null }
type CustomerGetPayload<T extends boolean | null | undefined | { select?: Prisma.UserSelect | null }> = Prisma.UserGetPayload<T>
type CustomerPropSelect<ArgsSelect extends CustomerGetPayloadTypes> = CustomerGetPayload<ArgsSelect>
type CustomerFindResponse<ArgsSelect extends CustomerGetPayloadTypes> = CustomerPropSelect<ArgsSelect>

@Service({ name: 'customer.repository' })
export class CustomerRepository extends Repository {
    private static GLOBAL_MESSAGE = {
        create: {
            title: 'Register Customer',
            success: 'Customer successfully registered',
            failed: 'Failed to register customer'
        },
        remove: {
            title: 'Remove Customer',
            success: 'Customer successfully removed',
            failed: 'Failed to remove customer'
        },
        update: {
            title: 'Update Customer',
            success: 'Customer successfully updated',
            failed: 'Failed to update customer data'
        },
        find: {
            title: 'Find Customer',
            notFound: 'Customer not found',
            failed: 'Unable to query customer'
        },
        findMany: {
            title: 'Find Customers',
            failed: 'Unable to query customers'
        }
    }

    async create(args: { data: Omit<Prisma.UserCreateInput, 'type'> }) {
        try {
            await this.database.instance.user.create({ ...args, data: { ...args.data, type: UserModel.Type.CUSTOMER } })

            return this.handleResponse<{ message: string }>({ message: CustomerRepository.GLOBAL_MESSAGE.create.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: CustomerRepository.GLOBAL_MESSAGE.create.title, message: CustomerRepository.GLOBAL_MESSAGE.create.failed }
            })
        }
    }

    async update(args: { where: Prisma.UserWhereUniqueInput, data: Omit<Prisma.UserUpdateInput, 'type'> }) {
        try {
            await this.database.instance.user.update({ ...args })

            return this.handleResponse<{ message: string }>({ message: CustomerRepository.GLOBAL_MESSAGE.update.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: CustomerRepository.GLOBAL_MESSAGE.update.title, message: CustomerRepository.GLOBAL_MESSAGE.update.failed }
            })
        }
    }

    async delete(args: { where: Prisma.UserWhereUniqueInput }) {
        try {
            await this.database.instance.user.delete({ ...args })

            return this.handleResponse<{ message: string }>({ message: CustomerRepository.GLOBAL_MESSAGE.remove.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: CustomerRepository.GLOBAL_MESSAGE.remove.title, message: CustomerRepository.GLOBAL_MESSAGE.remove.failed }
            })
        }
    }

    async findFirst<Args extends Prisma.UserFindFirstArgs>(args: Args) {
        try {
            const customer = await this.database.instance.user.findFirst(args) as CustomerFindResponse<Args>

            return this.handleResponse<CustomerFindResponse<Args>>(customer, {
                noAcceptNullable: true,
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<CustomerFindResponse<Args>>(err, {
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findUnique<Args extends Prisma.UserFindUniqueArgs>(args: Args) {
        try {
            const customer = await this.database.instance.user.findUnique(args) as CustomerFindResponse<Args>

            return this.handleResponse<CustomerFindResponse<Args>>(customer, {
                noAcceptNullable: true,
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<CustomerFindResponse<Args>>(err, {
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findMany<Args extends Prisma.UserFindManyArgs>(args: Args) {
        try {
            const customer = await this.database.instance.user.findMany(args) as CustomerFindResponse<Args>[]

            return this.handleResponse<CustomerFindResponse<Args>[]>(customer, {
                noAcceptNullable: true,
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<CustomerFindResponse<Args>[]>(err, {
                error: { title: CustomerRepository.GLOBAL_MESSAGE.find.title, message: CustomerRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }
}
