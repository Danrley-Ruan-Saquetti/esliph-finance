import { $Enums, People as PeoplePrisma, Prisma } from '@prisma/client'
import { NotFoundException } from '@exceptions/not-found'
import { DatabaseException } from '@exceptions/database'
import { DatabaseRepository, GenerateGlobalMessagesRepository } from '@common/repository'

type PeopleGetPayloadTypes = boolean | null | undefined | { select?: Prisma.PeopleSelect | null }
type PeopleGetPayload<T extends boolean | null | undefined | { select?: Prisma.PeopleSelect | null }> = Prisma.PeopleGetPayload<T>
type PeoplePropSelect<ArgsSelect extends PeopleGetPayloadTypes> = PeopleGetPayload<ArgsSelect>
type PeopleFindResponse<ArgsSelect extends PeopleGetPayloadTypes> = PeoplePropSelect<ArgsSelect>

export namespace PeopleModel {
    export type People = PeoplePrisma

    export const {
        PeopleGender: Gender,
        PeopleType: Type,
    } = $Enums
    export type Type = keyof typeof Type
    export type Gender = keyof typeof Gender

    export class Repository extends DatabaseRepository {
        private static MESSAGES = GenerateGlobalMessagesRepository('people')

        async create(args: Prisma.PeopleCreateArgs) {
            try {
                return await this.repo.create({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.create.title,
                    message: Repository.MESSAGES.create.failed,
                })
            }
        }

        async createMany(args: Prisma.PeopleCreateManyArgs) {
            try {
                return await this.repo.createMany({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.createMany.title,
                    message: Repository.MESSAGES.createMany.failed,
                })
            }
        }

        async update(args: Prisma.PeopleUpdateArgs) {
            try {
                return await this.repo.update({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.update.title,
                    message: Repository.MESSAGES.update.failed,
                })
            }
        }

        async updateMany(args: Prisma.PeopleUpdateManyArgs) {
            try {
                return await this.repo.updateMany({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.updateMany.title,
                    message: Repository.MESSAGES.updateMany.failed,
                })
            }
        }

        async delete(args: Prisma.PeopleDeleteArgs) {
            try {
                return await this.repo.delete({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.delete.title,
                    message: Repository.MESSAGES.delete.failed,
                })
            }
        }

        async deleteMany(args: Prisma.PeopleDeleteManyArgs) {
            try {
                return await this.repo.deleteMany({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.deleteMany.title,
                    message: Repository.MESSAGES.deleteMany.failed,
                })
            }
        }

        async checkExistsOrTrow(args: Prisma.PeopleFindFirstArgs) {
            await this.findFirstOrThrow(args)
        }

        async isExists(args: Prisma.PeopleFindFirstArgs) {
            return !!(await this.findFirst(args))
        }

        async findFirstOrThrow<Args extends Prisma.PeopleFindFirstArgs>(args: Args) {
            const people = await this.findFirst<Args>({ ...args })

            if (!people)
                throw new NotFoundException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.notFound,
                })

            return people
        }
        async findFirst<Args extends Prisma.PeopleFindFirstArgs>(args: Args) {
            try {
                return await this.repo.findFirst({ ...args }) as PeopleFindResponse<Args>
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.failed,
                })
            }
        }

        async findUniqueOrThrow<Args extends Prisma.PeopleFindUniqueArgs>(args: Args) {
            const people = await this.findUnique<Args>({ ...args })

            if (!people)
                throw new NotFoundException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.notFound,
                })

            return people
        }

        async findUnique<Args extends Prisma.PeopleFindUniqueArgs>(args: Args) {
            try {
                return await this.repo.findUnique({ ...args }) as PeopleFindResponse<Args>
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.failed,
                })
            }
        }

        async query<Args extends Prisma.PeopleFindManyArgs>(args: Args, page: { pageIndex: number, limite: number }) {
            const total = await this.count({ where: args.where })

            const peoples = await this.findMany<Args>({
                ...args,
                skip: page.pageIndex * page.limite,
                take: page.limite
            })

            return {
                peoples: peoples || [],
                metadata: {
                    currentPage: page.pageIndex + 1,
                    itemsPerPage: page.limite,
                    totalItems: total,
                    totalPages: Math.ceil(total / page.limite),
                }
            }
        }

        async findMany<Args extends Prisma.PeopleFindManyArgs>(args: Args) {
            try {
                return await this.repo.findMany({ ...args }) as PeopleFindResponse<Args>[]
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.findMany.title,
                    message: Repository.MESSAGES.findMany.failed,
                })
            }
        }

        async count(args: Prisma.PeopleCountArgs) {
            try {
                return await this.repo.count({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.count.title,
                    message: Repository.MESSAGES.count.failed,
                })
            }
        }

        private get repo() { return this.database.instance.people }
    }

    export const peopleRepository = new Repository()
}