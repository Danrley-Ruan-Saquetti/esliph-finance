import { Service } from '@esliph/module'
import { Repository } from '@services/repository.service'
import { Prisma } from '@services/database.service'

type PeopleGetPayloadTypes = boolean | null | undefined | { select?: Prisma.PeopleSelect | null }
type PeopleGetPayload<T extends boolean | null | undefined | { select?: Prisma.PeopleSelect | null }> = Prisma.PeopleGetPayload<T>
type PeoplePropSelect<ArgsSelect extends PeopleGetPayloadTypes> = PeopleGetPayload<ArgsSelect>
type PeopleFindResponse<ArgsSelect extends PeopleGetPayloadTypes> = PeoplePropSelect<ArgsSelect>

@Service({ name: 'people.repository' })
export class PeopleRepository extends Repository {
    private static GLOBAL_MESSAGE = {
        create: {
            title: 'Register People',
            success: 'People successfully registered',
            failed: 'Failed to register people'
        },
        delete: {
            title: 'Remove People',
            success: 'People successfully removed',
            failed: 'Failed to remove people'
        },
        update: {
            title: 'Update People',
            success: 'People successfully updated',
            failed: 'Failed to update people data'
        },
        find: {
            title: 'Find People',
            notFound: 'People not found',
            failed: 'Unable to query people'
        },
        findMany: {
            title: 'Find Peoples',
            failed: 'Unable to query peoples'
        }
    }

    async create(args: { data: Prisma.PeopleCreateInput }) {
        try {
            await this.database.instance.people.create({ ...args, include: {} })

            return this.handleResponse<{ message: string }>({ message: PeopleRepository.GLOBAL_MESSAGE.create.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: PeopleRepository.GLOBAL_MESSAGE.create.title, message: PeopleRepository.GLOBAL_MESSAGE.create.failed }
            })
        }
    }

    async update(args: { where: Prisma.PeopleWhereUniqueInput, data: Prisma.PeopleUpdateInput }) {
        try {
            await this.database.instance.people.update({ ...args, include: {} })

            return this.handleResponse<{ message: string }>({ message: PeopleRepository.GLOBAL_MESSAGE.update.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: PeopleRepository.GLOBAL_MESSAGE.update.title, message: PeopleRepository.GLOBAL_MESSAGE.update.failed }
            })
        }
    }

    async delete(where: Prisma.PeopleWhereUniqueInput) {
        try {
            await this.database.instance.people.delete({ where })

            return this.handleResponse<{ message: string }>({ message: PeopleRepository.GLOBAL_MESSAGE.delete.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: PeopleRepository.GLOBAL_MESSAGE.delete.title, message: PeopleRepository.GLOBAL_MESSAGE.delete.failed }
            })
        }
    }

    async findFirst<Args extends Prisma.PeopleFindFirstArgs>(args: Args) {
        try {
            const people = await this.database.instance.people.findFirst(args) as PeopleFindResponse<Args>

            return this.handleResponse<PeopleFindResponse<Args>>(people, {
                noAcceptNullable: true,
                error: { title: PeopleRepository.GLOBAL_MESSAGE.find.title, message: PeopleRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<PeopleFindResponse<Args>>(err, {
                error: { title: PeopleRepository.GLOBAL_MESSAGE.find.title, message: PeopleRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findUnique<Args extends Prisma.PeopleFindUniqueArgs>(args: Args) {
        try {
            const people = await this.database.instance.people.findUnique(args) as PeopleFindResponse<Args>

            return this.handleResponse<PeopleFindResponse<Args>>(people, {
                noAcceptNullable: true,
                error: { title: PeopleRepository.GLOBAL_MESSAGE.find.title, message: PeopleRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<PeopleFindResponse<Args>>(err, {
                error: { title: PeopleRepository.GLOBAL_MESSAGE.find.title, message: PeopleRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findMany<Args extends Prisma.PeopleFindManyArgs>(args: Args) {
        try {
            const people = await this.database.instance.people.findMany(args) as PeopleFindResponse<Args>[]

            return this.handleResponse<PeopleFindResponse<Args>[]>(people, {
                noAcceptNullable: true,
                error: { title: PeopleRepository.GLOBAL_MESSAGE.find.title, message: PeopleRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<PeopleFindResponse<Args>[]>(err, {
                error: { title: PeopleRepository.GLOBAL_MESSAGE.find.title, message: PeopleRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }
}