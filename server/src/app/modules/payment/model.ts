import { Payment as PaymentPrisma, Prisma } from '@prisma/client'
import { NotFoundException } from '@exceptions/not-found'
import { DatabaseException } from '@exceptions/database'
import { DatabaseRepository, GenerateGlobalMessagesRepository } from '@common/repository'

type PaymentGetPayloadTypes = boolean | null | undefined | { select?: Prisma.PaymentSelect | null }
type PaymentGetPayload<T extends boolean | null | undefined | { select?: Prisma.PaymentSelect | null }> = Prisma.PaymentGetPayload<T>
type PaymentPropSelect<ArgsSelect extends PaymentGetPayloadTypes> = PaymentGetPayload<ArgsSelect>
type PaymentFindResponse<ArgsSelect extends PaymentGetPayloadTypes> = PaymentPropSelect<ArgsSelect>

export namespace PaymentModel {
    export type Payment = PaymentPrisma

    export class Repository extends DatabaseRepository {
        private static MESSAGES = GenerateGlobalMessagesRepository('payment')

        async create(args: Prisma.PaymentCreateArgs) {
            try {
                return await this.repo.create({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.create.title,
                    message: Repository.MESSAGES.create.failed,
                })
            }
        }

        async createMany(args: Prisma.PaymentCreateManyArgs) {
            try {
                return await this.repo.createMany({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.createMany.title,
                    message: Repository.MESSAGES.createMany.failed,
                })
            }
        }

        async update(args: Prisma.PaymentUpdateArgs) {
            try {
                return await this.repo.update({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.update.title,
                    message: Repository.MESSAGES.update.failed,
                })
            }
        }

        async updateMany(args: Prisma.PaymentUpdateManyArgs) {
            try {
                return await this.repo.updateMany({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.updateMany.title,
                    message: Repository.MESSAGES.updateMany.failed,
                })
            }
        }

        async delete(args: Prisma.PaymentDeleteArgs) {
            try {
                return await this.repo.delete({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.delete.title,
                    message: Repository.MESSAGES.delete.failed,
                })
            }
        }

        async deleteMany(args: Prisma.PaymentDeleteManyArgs) {
            try {
                return await this.repo.deleteMany({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.deleteMany.title,
                    message: Repository.MESSAGES.deleteMany.failed,
                })
            }
        }

        async checkExistsOrTrow(args: Prisma.PaymentFindFirstArgs) {
            await this.findFirstOrThrow(args)
        }

        async isExists(args: Prisma.PaymentFindFirstArgs) {
            return !!(await this.findFirst(args))
        }

        async findFirstOrThrow<Args extends Prisma.PaymentFindFirstArgs>(args: Args) {
            const payment = await this.findFirst<Args>({ ...args })

            if (!payment)
                throw new NotFoundException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.notFound,
                })

            return payment
        }
        async findFirst<Args extends Prisma.PaymentFindFirstArgs>(args: Args) {
            try {
                return await this.repo.findFirst({ ...args }) as PaymentFindResponse<Args>
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.failed,
                })
            }
        }

        async findUniqueOrThrow<Args extends Prisma.PaymentFindUniqueArgs>(args: Args) {
            const payment = await this.findUnique<Args>({ ...args })

            if (!payment)
                throw new NotFoundException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.notFound,
                })

            return payment
        }

        async findUnique<Args extends Prisma.PaymentFindUniqueArgs>(args: Args) {
            try {
                return await this.repo.findUnique({ ...args }) as PaymentFindResponse<Args>
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.failed,
                })
            }
        }

        async query<Args extends Prisma.PaymentFindManyArgs>(args: Args, page: { pageIndex: number, limite: number }) {
            const total = await this.count({ where: args.where })

            const payments = await this.findMany<Args>({
                ...args,
                skip: page.pageIndex * page.limite,
                take: page.limite
            })

            return {
                payments: payments || [],
                metadata: {
                    currentPage: page.pageIndex + 1,
                    itemsPerPage: page.limite,
                    totalItems: total,
                    totalPages: Math.ceil(total / page.limite),
                }
            }
        }

        async findMany<Args extends Prisma.PaymentFindManyArgs>(args: Args) {
            try {
                return await this.repo.findMany({ ...args }) as PaymentFindResponse<Args>[]
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.findMany.title,
                    message: Repository.MESSAGES.findMany.failed,
                })
            }
        }

        async count(args: Prisma.PaymentCountArgs) {
            try {
                return await this.repo.count({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.count.title,
                    message: Repository.MESSAGES.count.failed,
                })
            }
        }

        private get repo() { return this.database.instance.payment }
    }

    export const paymentRepository = new Repository()
}