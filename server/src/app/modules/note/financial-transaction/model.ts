import { FinancialTransactionNote as FinancialTransactionNotePrisma, Prisma } from '@prisma/client'
import { NotFoundException } from '@exceptions/not-found'
import { DatabaseException } from '@exceptions/database'
import { DatabaseRepository, GenerateGlobalMessagesRepository } from '@common/repository'

type FinancialTransactionNoteGetPayloadTypes = boolean | null | undefined | { select?: Prisma.FinancialTransactionNoteSelect | null }
type FinancialTransactionNoteGetPayload<T extends boolean | null | undefined | { select?: Prisma.FinancialTransactionNoteSelect | null }> = Prisma.FinancialTransactionNoteGetPayload<T>
type FinancialTransactionNotePropSelect<ArgsSelect extends FinancialTransactionNoteGetPayloadTypes> = FinancialTransactionNoteGetPayload<ArgsSelect>
type FinancialTransactionNoteFindResponse<ArgsSelect extends FinancialTransactionNoteGetPayloadTypes> = FinancialTransactionNotePropSelect<ArgsSelect>

export namespace FinancialTransactionNoteModel {
    export type FinancialTransactionNote = FinancialTransactionNotePrisma

    export class Repository extends DatabaseRepository {
        private static MESSAGES = GenerateGlobalMessagesRepository('financial transaction note')

        async create(args: Prisma.FinancialTransactionNoteCreateArgs) {
            try {
                return await this.repo.create({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.create.title,
                    message: Repository.MESSAGES.create.failed,
                })
            }
        }

        async createMany(args: Prisma.FinancialTransactionNoteCreateManyArgs) {
            try {
                return await this.repo.createMany({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.createMany.title,
                    message: Repository.MESSAGES.createMany.failed,
                })
            }
        }

        async update(args: Prisma.FinancialTransactionNoteUpdateArgs) {
            try {
                return await this.repo.update({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.update.title,
                    message: Repository.MESSAGES.update.failed,
                })
            }
        }

        async updateMany(args: Prisma.FinancialTransactionNoteUpdateManyArgs) {
            try {
                return await this.repo.updateMany({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.updateMany.title,
                    message: Repository.MESSAGES.updateMany.failed,
                })
            }
        }

        async delete(args: Prisma.FinancialTransactionNoteDeleteArgs) {
            try {
                return await this.repo.delete({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.delete.title,
                    message: Repository.MESSAGES.delete.failed,
                })
            }
        }

        async deleteMany(args: Prisma.FinancialTransactionNoteDeleteManyArgs) {
            try {
                return await this.repo.deleteMany({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.deleteMany.title,
                    message: Repository.MESSAGES.deleteMany.failed,
                })
            }
        }

        async checkExistsOrTrow(args: Prisma.FinancialTransactionNoteFindFirstArgs) {
            await this.findFirstOrThrow(args)
        }

        async isExists(args: Prisma.FinancialTransactionNoteFindFirstArgs) {
            return !!(await this.findFirst(args))
        }

        async findFirstOrThrow<Args extends Prisma.FinancialTransactionNoteFindFirstArgs>(args: Args) {
            const FinancialTransactionNote = await this.findFirst<Args>({ ...args })

            if (!FinancialTransactionNote)
                throw new NotFoundException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.notFound,
                })

            return FinancialTransactionNote
        }
        async findFirst<Args extends Prisma.FinancialTransactionNoteFindFirstArgs>(args: Args) {
            try {
                return await this.repo.findFirst({ ...args }) as FinancialTransactionNoteFindResponse<Args>
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.failed,
                })
            }
        }

        async findUniqueOrThrow<Args extends Prisma.FinancialTransactionNoteFindUniqueArgs>(args: Args) {
            const FinancialTransactionNote = await this.findUnique<Args>({ ...args })

            if (!FinancialTransactionNote)
                throw new NotFoundException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.notFound,
                })

            return FinancialTransactionNote
        }

        async findUnique<Args extends Prisma.FinancialTransactionNoteFindUniqueArgs>(args: Args) {
            try {
                return await this.repo.findUnique({ ...args }) as FinancialTransactionNoteFindResponse<Args>
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.failed,
                })
            }
        }

        async query<Args extends Prisma.FinancialTransactionNoteFindManyArgs>(args: Args, page: { pageIndex: number, limite: number }) {
            const total = await this.count({ where: args.where })

            const FinancialTransactionNotes = await this.findMany<Args>({
                ...args,
                skip: page.pageIndex * page.limite,
                take: page.limite
            })

            return {
                FinancialTransactionNotes: FinancialTransactionNotes || [],
                metadata: {
                    currentPage: page.pageIndex + 1,
                    itemsPerPage: page.limite,
                    totalItems: total,
                    totalPages: Math.ceil(total / page.limite),
                }
            }
        }

        async findMany<Args extends Prisma.FinancialTransactionNoteFindManyArgs>(args: Args) {
            try {
                return await this.repo.findMany({ ...args }) as FinancialTransactionNoteFindResponse<Args>[]
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.findMany.title,
                    message: Repository.MESSAGES.findMany.failed,
                })
            }
        }

        async count(args: Prisma.FinancialTransactionNoteCountArgs) {
            try {
                return await this.repo.count({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.count.title,
                    message: Repository.MESSAGES.count.failed,
                })
            }
        }

        private get repo() { return this.database.instance.financialTransactionNote }
    }

    export const financialTransactionNoteRepository = new Repository()
}
