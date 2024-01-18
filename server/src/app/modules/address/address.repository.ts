import { Prisma } from '@prisma/client'
import { Service } from '@core'
import { Repository } from '@services/repository.service'

type AddressGetPayloadTypes = boolean | null | undefined | { select?: Prisma.AddressSelect | null }
type AddressGetPayload<T extends boolean | null | undefined | { select?: Prisma.AddressSelect | null }> = Prisma.AddressGetPayload<T>
type AddressPropSelect<ArgsSelect extends AddressGetPayloadTypes> = AddressGetPayload<ArgsSelect>
type AddressFindResponse<ArgsSelect extends AddressGetPayloadTypes> = AddressPropSelect<ArgsSelect>

@Service({ name: 'address.repository' })
export class AddressRepository extends Repository {
    private static GLOBAL_MESSAGE = {
        create: {
            title: 'Register Address',
            success: 'Address successfully registered',
            failed: 'Failed to register address'
        },
        createMany: {
            title: 'Register Addresses',
            success: 'Addresses successfully registered',
            failed: 'Failed to register addresses'
        },
        remove: {
            title: 'Remove Address',
            success: 'Address successfully removed',
            failed: 'Failed to remove address'
        },
        update: {
            title: 'Update Address',
            success: 'Address successfully updated',
            failed: 'Failed to update address data'
        },
        find: {
            title: 'Find Address',
            notFound: 'Address not found',
            failed: 'Unable to query address'
        },
        findMany: {
            title: 'Find Addresses',
            failed: 'Unable to query addresses'
        }
    }

    async create(args: { data: Prisma.AddressCreateInput }) {
        try {
            await this.database.instance.address.create({ ...args })

            return this.handleResponse<{ message: string }>({ message: AddressRepository.GLOBAL_MESSAGE.create.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: AddressRepository.GLOBAL_MESSAGE.create.title, message: AddressRepository.GLOBAL_MESSAGE.create.failed }
            })
        }
    }

    async createMany(args: { data: Prisma.AddressCreateManyInput[] }) {
        try {
            await this.database.instance.address.createMany({ ...args, skipDuplicates: true })

            return this.handleResponse<{ message: string }>({ message: AddressRepository.GLOBAL_MESSAGE.createMany.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: AddressRepository.GLOBAL_MESSAGE.createMany.title, message: AddressRepository.GLOBAL_MESSAGE.createMany.failed }
            })
        }
    }

    async update(args: { where: Prisma.AddressWhereUniqueInput, data: Prisma.AddressUpdateInput }) {
        try {
            await this.database.instance.address.update({ ...args })

            return this.handleResponse<{ message: string }>({ message: AddressRepository.GLOBAL_MESSAGE.update.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: AddressRepository.GLOBAL_MESSAGE.update.title, message: AddressRepository.GLOBAL_MESSAGE.update.failed }
            })
        }
    }

    async delete(args: { where: Prisma.AddressWhereUniqueInput }) {
        try {
            await this.database.instance.address.delete({ ...args })

            return this.handleResponse<{ message: string }>({ message: AddressRepository.GLOBAL_MESSAGE.remove.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: AddressRepository.GLOBAL_MESSAGE.remove.title, message: AddressRepository.GLOBAL_MESSAGE.remove.failed }
            })
        }
    }

    async findFirst<Args extends Prisma.AddressFindFirstArgs>(args: Args) {
        try {
            const address = await this.database.instance.address.findFirst(args) as AddressFindResponse<Args>

            return this.handleResponse<AddressFindResponse<Args>>(address, {
                noAcceptNullable: true,
                error: { title: AddressRepository.GLOBAL_MESSAGE.find.title, message: AddressRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<AddressFindResponse<Args>>(err, {
                error: { title: AddressRepository.GLOBAL_MESSAGE.find.title, message: AddressRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findUnique<Args extends Prisma.AddressFindUniqueArgs>(args: Args) {
        try {
            const address = await this.database.instance.address.findUnique(args) as AddressFindResponse<Args>

            return this.handleResponse<AddressFindResponse<Args>>(address, {
                noAcceptNullable: true,
                error: { title: AddressRepository.GLOBAL_MESSAGE.find.title, message: AddressRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<AddressFindResponse<Args>>(err, {
                error: { title: AddressRepository.GLOBAL_MESSAGE.find.title, message: AddressRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findMany<Args extends Prisma.AddressFindManyArgs>(args: Args) {
        try {
            const addresses = await this.database.instance.address.findMany(args) as AddressFindResponse<Args>[]

            return this.handleResponse<AddressFindResponse<Args>[]>(addresses, {
                noAcceptNullable: true,
                error: { title: AddressRepository.GLOBAL_MESSAGE.find.title, message: AddressRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<AddressFindResponse<Args>[]>(err, {
                error: { title: AddressRepository.GLOBAL_MESSAGE.find.title, message: AddressRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }
}
