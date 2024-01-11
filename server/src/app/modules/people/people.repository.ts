import { Service } from '@esliph/module'
import { ID } from '@@types'
import { Repository } from '@services/repository.service'
import { PeopleModel } from '@modules/people/people.model'

@Service({ name: 'people.repository' })
export class PeopleRepository extends Repository {
    private static GLOBAL_MESSAGE = {
        create: {
            title: 'Register People',
            success: 'People successfully registered',
            failed: 'Failed to register people'
        },
        remove: {
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

    async register(data: PeopleModel.Model) {
        try {
            await this.database.instance.people.create({ data: data })

            return this.handleResponse<{ message: string }>({ message: PeopleRepository.GLOBAL_MESSAGE.create.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: PeopleRepository.GLOBAL_MESSAGE.create.title, message: PeopleRepository.GLOBAL_MESSAGE.create.failed }
            })
        }
    }

    async updateById(args: PeopleModel.UpdateArgs, where: { id: number }) {
        try {
            await this.database.instance.people.update({ where: { id: where.id }, data: args })

            return this.handleResponse<{ message: string }>({ message: PeopleRepository.GLOBAL_MESSAGE.update.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: PeopleRepository.GLOBAL_MESSAGE.update.title, message: PeopleRepository.GLOBAL_MESSAGE.update.failed }
            })
        }
    }

    async removeById(where: { id: number }) {
        try {
            await this.database.instance.people.delete({ where: { id: where.id } })

            return this.handleResponse<{ message: string }>({ message: PeopleRepository.GLOBAL_MESSAGE.remove.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: PeopleRepository.GLOBAL_MESSAGE.remove.title, message: PeopleRepository.GLOBAL_MESSAGE.remove.failed }
            })
        }
    }

    async findById(id: ID) {
        try {
            const people = await this.database.instance.people.findFirst({ where: { id } })

            return this.handleResponse<PeopleModel.People>(people, {
                noAcceptNullable: true,
                error: { title: PeopleRepository.GLOBAL_MESSAGE.find.title, message: PeopleRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<PeopleModel.People>(err, {
                error: { title: PeopleRepository.GLOBAL_MESSAGE.find.title, message: PeopleRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findByUserId(userId: ID) {
        try {
            const people = await this.database.instance.people.findFirst({ where: { users: { some: { id: userId } } } })

            return this.handleResponse<PeopleModel.People>(people, {
                noAcceptNullable: true,
                error: { title: PeopleRepository.GLOBAL_MESSAGE.find.title, message: PeopleRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<PeopleModel.People>(err, {
                error: { title: PeopleRepository.GLOBAL_MESSAGE.find.title, message: PeopleRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findByIdWithAddressAndContacts(id: ID) {
        try {
            const people = await this.database.instance.people.findFirst({
                where: { id },
                include: {
                    addresses: true,
                    contacts: true
                }
            })

            return this.handleResponse<PeopleModel.People>(people, {
                noAcceptNullable: true,
                error: { title: PeopleRepository.GLOBAL_MESSAGE.find.title, message: PeopleRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<PeopleModel.People>(err, {
                error: { title: PeopleRepository.GLOBAL_MESSAGE.find.title, message: PeopleRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }
}
