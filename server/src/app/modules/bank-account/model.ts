import { BankAccount as BankAccountPrisma, Prisma } from '@prisma/client'
import { NotFoundException } from '@exceptions/not-found'
import { DatabaseException } from '@exceptions/database'
import { DatabaseRepository, GenerateGlobalMessagesRepository } from '@common/repository'

type BankAccountGetPayloadTypes = boolean | null | undefined | { select?: Prisma.BankAccountSelect | null }
type BankAccountGetPayload<T extends boolean | null | undefined | { select?: Prisma.BankAccountSelect | null }> = Prisma.BankAccountGetPayload<T>
type BankAccountPropSelect<ArgsSelect extends BankAccountGetPayloadTypes> = BankAccountGetPayload<ArgsSelect>
type BankAccountFindResponse<ArgsSelect extends BankAccountGetPayloadTypes> = BankAccountPropSelect<ArgsSelect>

export namespace BankAccountModel {
    export type BankAccount = BankAccountPrisma

    export class Repository extends DatabaseRepository {
        private static MESSAGES = GenerateGlobalMessagesRepository('bank account')

        async create(args: Prisma.BankAccountCreateArgs) {
            try {
                return await this.repo.create({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.create.title,
                    message: Repository.MESSAGES.create.failed,
                })
            }
        }

        async createMany(args: Prisma.BankAccountCreateManyArgs) {
            try {
                return await this.repo.createMany({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.createMany.title,
                    message: Repository.MESSAGES.createMany.failed,
                })
            }
        }

        async update(args: Prisma.BankAccountUpdateArgs) {
            try {
                return await this.repo.update({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.update.title,
                    message: Repository.MESSAGES.update.failed,
                })
            }
        }

        async updateMany(args: Prisma.BankAccountUpdateManyArgs) {
            try {
                return await this.repo.updateMany({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.updateMany.title,
                    message: Repository.MESSAGES.updateMany.failed,
                })
            }
        }

        async delete(args: Prisma.BankAccountDeleteArgs) {
            try {
                return await this.repo.delete({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.delete.title,
                    message: Repository.MESSAGES.delete.failed,
                })
            }
        }

        async deleteMany(args: Prisma.BankAccountDeleteManyArgs) {
            try {
                return await this.repo.deleteMany({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.deleteMany.title,
                    message: Repository.MESSAGES.deleteMany.failed,
                })
            }
        }

        async checkExistsOrTrow(args: Prisma.BankAccountFindFirstArgs) {
            await this.findFirstOrThrow(args)
        }

        async isExists(args: Prisma.BankAccountFindFirstArgs) {
            return !!(await this.findFirst(args))
        }

        async findFirstOrThrow<Args extends Prisma.BankAccountFindFirstArgs>(args: Args) {
            const bankAccount = await this.findFirst<Args>({ ...args })

            if (!bankAccount)
                throw new NotFoundException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.notFound,
                })

            return bankAccount
        }
        async findFirst<Args extends Prisma.BankAccountFindFirstArgs>(args: Args) {
            try {
                return await this.repo.findFirst({ ...args }) as BankAccountFindResponse<Args>
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.failed,
                })
            }
        }

        async findUniqueOrThrow<Args extends Prisma.BankAccountFindUniqueArgs>(args: Args) {
            const bankAccount = await this.findUnique<Args>({ ...args })

            if (!bankAccount)
                throw new NotFoundException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.notFound,
                })

            return bankAccount
        }

        async findUnique<Args extends Prisma.BankAccountFindUniqueArgs>(args: Args) {
            try {
                return await this.repo.findUnique({ ...args }) as BankAccountFindResponse<Args>
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.failed,
                })
            }
        }

        async query<Args extends Prisma.BankAccountFindManyArgs>(args: Args, page: { pageIndex: number, limite: number }) {
            const total = await this.count({ where: args.where })

            const bankAccounts = await this.findMany<Args>({
                ...args,
                skip: page.pageIndex * page.limite,
                take: page.limite
            })

            return {
                bankAccounts: bankAccounts || [],
                metadata: {
                    currentPage: page.pageIndex + 1,
                    itemsPerPage: page.limite,
                    totalItems: total,
                    totalPages: Math.ceil(total / page.limite),
                }
            }
        }

        async findMany<Args extends Prisma.BankAccountFindManyArgs>(args: Args) {
            try {
                return await this.repo.findMany({ ...args }) as BankAccountFindResponse<Args>[]
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.findMany.title,
                    message: Repository.MESSAGES.findMany.failed,
                })
            }
        }

        async count(args: Prisma.BankAccountCountArgs) {
            try {
                return await this.repo.count({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.count.title,
                    message: Repository.MESSAGES.count.failed,
                })
            }
        }

        private get repo() { return this.database.instance.bankAccount }
    }

    export const bankAccountRepository = new Repository()
}