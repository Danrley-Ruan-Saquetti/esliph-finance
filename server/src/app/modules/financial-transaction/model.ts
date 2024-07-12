import { $Enums, FinancialTransaction as FinancialTransactionPrisma, Prisma } from '@prisma/client'
import { NotFoundException } from '@exceptions/not-found'
import { DatabaseException } from '@exceptions/database'
import { DatabaseRepository, GenerateGlobalMessagesRepository } from '@common/repository'

type FinancialTransactionGetPayloadTypes = boolean | null | undefined | { select?: Prisma.FinancialTransactionSelect | null }
type FinancialTransactionGetPayload<T extends boolean | null | undefined | { select?: Prisma.FinancialTransactionSelect | null }> = Prisma.FinancialTransactionGetPayload<T>
type FinancialTransactionPropSelect<ArgsSelect extends FinancialTransactionGetPayloadTypes> = FinancialTransactionGetPayload<ArgsSelect>
type FinancialTransactionFindResponse<ArgsSelect extends FinancialTransactionGetPayloadTypes> = FinancialTransactionPropSelect<ArgsSelect>

export namespace FinancialTransactionModel {
    export type FinancialTransaction = FinancialTransactionPrisma

    export const {
        FinancialTransactionType: Type,
        FinancialTransactionFrequency: Frequency,
        FinancialTransactionSituation: Situation,
        FinancialTransactionTypeOccurrence: TypeOccurrence,
    } = $Enums
    export type Type = keyof typeof Type
    export type Frequency = keyof typeof Frequency
    export type Situation = keyof typeof Situation
    export type TypeOccurrence = keyof typeof TypeOccurrence

    export class Repository extends DatabaseRepository {
        private static MESSAGES = GenerateGlobalMessagesRepository('financial transaction')

        async create(args: Prisma.FinancialTransactionCreateArgs) {
            try {
                return await this.repo.create({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.create.title,
                    message: Repository.MESSAGES.create.failed,
                })
            }
        }

        async createMany(args: Prisma.FinancialTransactionCreateManyArgs) {
            try {
                return await this.repo.createMany({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.createMany.title,
                    message: Repository.MESSAGES.createMany.failed,
                })
            }
        }

        async update(args: Prisma.FinancialTransactionUpdateArgs) {
            try {
                return await this.repo.update({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.update.title,
                    message: Repository.MESSAGES.update.failed,
                })
            }
        }

        async updateMany(args: Prisma.FinancialTransactionUpdateManyArgs) {
            try {
                return await this.repo.updateMany({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.updateMany.title,
                    message: Repository.MESSAGES.updateMany.failed,
                })
            }
        }

        async delete(args: Prisma.FinancialTransactionDeleteArgs) {
            try {
                return await this.repo.delete({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.delete.title,
                    message: Repository.MESSAGES.delete.failed,
                })
            }
        }

        async deleteMany(args: Prisma.FinancialTransactionDeleteManyArgs) {
            try {
                return await this.repo.deleteMany({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.deleteMany.title,
                    message: Repository.MESSAGES.deleteMany.failed,
                })
            }
        }

        async checkExistsOrTrow(args: Prisma.FinancialTransactionFindFirstArgs) {
            await this.findFirstOrThrow(args)
        }

        async isExists(args: Prisma.FinancialTransactionFindFirstArgs) {
            return !!(await this.findFirst(args))
        }

        async findFirstOrThrow<Args extends Prisma.FinancialTransactionFindFirstArgs>(args: Args) {
            const financialTransaction = await this.findFirst<Args>({ ...args })

            if (!financialTransaction)
                throw new NotFoundException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.notFound,
                })

            return financialTransaction as FinancialTransactionFindResponse<Args>
        }
        async findFirst<Args extends Prisma.FinancialTransactionFindFirstArgs>(args: Args) {
            try {
                return await this.repo.findFirst({ ...args }) as FinancialTransactionFindResponse<Args> | null
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.failed,
                })
            }
        }

        async findUniqueOrThrow<Args extends Prisma.FinancialTransactionFindUniqueArgs>(args: Args) {
            const financialTransaction = await this.findUnique<Args>({ ...args })

            if (!financialTransaction)
                throw new NotFoundException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.notFound,
                })

            return financialTransaction as FinancialTransactionFindResponse<Args>
        }

        async findUnique<Args extends Prisma.FinancialTransactionFindUniqueArgs>(args: Args) {
            try {
                return await this.repo.findUnique({ ...args }) as FinancialTransactionFindResponse<Args> | null
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.failed,
                })
            }
        }

        async query<Args extends Prisma.FinancialTransactionFindManyArgs>(args: Args, page: { pageIndex: number, limite: number }) {
            const total = await this.count({ where: args.where })

            const financialTransactions = await this.findMany<Args>({
                ...args,
                skip: page.pageIndex * page.limite,
                take: page.limite
            })

            return {
                financialTransactions: financialTransactions as FinancialTransactionFindResponse<Args>[] || [],
                metadata: {
                    currentPage: page.pageIndex + 1,
                    itemsPerPage: page.limite,
                    totalItems: total,
                    totalPages: Math.ceil(total / page.limite),
                }
            }
        }

        async findMany<Args extends Prisma.FinancialTransactionFindManyArgs>(args: Args) {
            try {
                return await this.repo.findMany({ ...args }) as FinancialTransactionFindResponse<Args>[]
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.findMany.title,
                    message: Repository.MESSAGES.findMany.failed,
                })
            }
        }

        async count(args: Prisma.FinancialTransactionCountArgs) {
            try {
                return await this.repo.count({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.count.title,
                    message: Repository.MESSAGES.count.failed,
                })
            }
        }

        private get repo() { return this.database.instance.financialTransaction }
    }

    export const financialTransactionRepository = new Repository()
}