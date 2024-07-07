import { ChangeLog as ChangeLogPrisma, Prisma } from '@prisma/client'
import { NotFoundException } from '@exceptions/not-found'
import { DatabaseException } from '@exceptions/database'
import { DatabaseRepository, GenerateGlobalMessagesRepository } from '@common/repository'

type ChangeLogGetPayloadTypes = boolean | null | undefined | { select?: Prisma.ChangeLogSelect | null }
type ChangeLogGetPayload<T extends boolean | null | undefined | { select?: Prisma.ChangeLogSelect | null }> = Prisma.ChangeLogGetPayload<T>
type ChangeLogPropSelect<ArgsSelect extends ChangeLogGetPayloadTypes> = ChangeLogGetPayload<ArgsSelect>
type ChangeLogFindResponse<ArgsSelect extends ChangeLogGetPayloadTypes> = ChangeLogPropSelect<ArgsSelect>

export namespace ChangeLogModel {
    export type ChangeLog = ChangeLogPrisma

    export class Repository extends DatabaseRepository {
        private static MESSAGES = GenerateGlobalMessagesRepository('change log')

        async create(args: Prisma.ChangeLogCreateArgs) {
            try {
                return await this.repo.create({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.create.title,
                    message: Repository.MESSAGES.create.failed,
                })
            }
        }

        async createMany(args: Prisma.ChangeLogCreateManyArgs) {
            try {
                return await this.repo.createMany({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.createMany.title,
                    message: Repository.MESSAGES.createMany.failed,
                })
            }
        }

        async update(args: Prisma.ChangeLogUpdateArgs) {
            try {
                return await this.repo.update({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.update.title,
                    message: Repository.MESSAGES.update.failed,
                })
            }
        }

        async updateMany(args: Prisma.ChangeLogUpdateManyArgs) {
            try {
                return await this.repo.updateMany({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.updateMany.title,
                    message: Repository.MESSAGES.updateMany.failed,
                })
            }
        }

        async delete(args: Prisma.ChangeLogDeleteArgs) {
            try {
                return await this.repo.delete({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.delete.title,
                    message: Repository.MESSAGES.delete.failed,
                })
            }
        }

        async deleteMany(args: Prisma.ChangeLogDeleteManyArgs) {
            try {
                return await this.repo.deleteMany({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.deleteMany.title,
                    message: Repository.MESSAGES.deleteMany.failed,
                })
            }
        }

        async checkExistsOrTrow(args: Prisma.ChangeLogFindFirstArgs) {
            await this.findFirstOrThrow(args)
        }

        async isExists(args: Prisma.ChangeLogFindFirstArgs) {
            return !!(await this.findFirst(args))
        }

        async findFirstOrThrow<Args extends Prisma.ChangeLogFindFirstArgs>(args: Args) {
            const changeLog = await this.findFirst<Args>({ ...args })

            if (!changeLog)
                throw new NotFoundException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.notFound,
                })

            return changeLog
        }
        async findFirst<Args extends Prisma.ChangeLogFindFirstArgs>(args: Args) {
            try {
                return await this.repo.findFirst({ ...args }) as ChangeLogFindResponse<Args>
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.failed,
                })
            }
        }

        async findUniqueOrThrow<Args extends Prisma.ChangeLogFindUniqueArgs>(args: Args) {
            const changeLog = await this.findUnique<Args>({ ...args })

            if (!changeLog)
                throw new NotFoundException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.notFound,
                })

            return changeLog
        }

        async findUnique<Args extends Prisma.ChangeLogFindUniqueArgs>(args: Args) {
            try {
                return await this.repo.findUnique({ ...args }) as ChangeLogFindResponse<Args>
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.failed,
                })
            }
        }

        async query<Args extends Prisma.ChangeLogFindManyArgs>(args: Args, page: { pageIndex: number, limite: number }) {
            const total = await this.count({ where: args.where })

            const changeLogs = await this.findMany<Args>({
                ...args,
                skip: page.pageIndex * page.limite,
                take: page.limite
            })

            return {
                changeLogs: changeLogs || [],
                metadata: {
                    currentPage: page.pageIndex + 1,
                    itemsPerPage: page.limite,
                    totalItems: total,
                    totalPages: Math.ceil(total / page.limite),
                }
            }
        }

        async findMany<Args extends Prisma.ChangeLogFindManyArgs>(args: Args) {
            try {
                return await this.repo.findMany({ ...args }) as ChangeLogFindResponse<Args>[]
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.findMany.title,
                    message: Repository.MESSAGES.findMany.failed,
                })
            }
        }

        async count(args: Prisma.ChangeLogCountArgs) {
            try {
                return await this.repo.count({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.count.title,
                    message: Repository.MESSAGES.count.failed,
                })
            }
        }

        private get repo() { return this.database.instance.changeLog }
    }

    export const changeLogRepository = new Repository()
}