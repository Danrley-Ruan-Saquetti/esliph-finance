import { Category as CategoryPrisma, Prisma } from '@prisma/client'
import { NotFoundException } from '@exceptions/not-found'
import { DatabaseException } from '@exceptions/database'
import { DatabaseRepository, GenerateGlobalMessagesRepository } from '@common/repository'

type CategoryGetPayloadTypes = boolean | null | undefined | { select?: Prisma.CategorySelect | null }
type CategoryGetPayload<T extends boolean | null | undefined | { select?: Prisma.CategorySelect | null }> = Prisma.CategoryGetPayload<T>
type CategoryPropSelect<ArgsSelect extends CategoryGetPayloadTypes> = CategoryGetPayload<ArgsSelect>
type CategoryFindResponse<ArgsSelect extends CategoryGetPayloadTypes> = CategoryPropSelect<ArgsSelect>

export namespace CategoryModel {
    export type Category = CategoryPrisma

    export class Repository extends DatabaseRepository {
        private static MESSAGES = GenerateGlobalMessagesRepository('category', 'categories')

        async create(args: Prisma.CategoryCreateArgs) {
            try {
                return await this.repo.create({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.create.title,
                    message: Repository.MESSAGES.create.failed,
                })
            }
        }

        async createMany(args: Prisma.CategoryCreateManyArgs) {
            try {
                return await this.repo.createMany({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.createMany.title,
                    message: Repository.MESSAGES.createMany.failed,
                })
            }
        }

        async update(args: Prisma.CategoryUpdateArgs) {
            try {
                return await this.repo.update({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.update.title,
                    message: Repository.MESSAGES.update.failed,
                })
            }
        }

        async updateMany(args: Prisma.CategoryUpdateManyArgs) {
            try {
                return await this.repo.updateMany({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.updateMany.title,
                    message: Repository.MESSAGES.updateMany.failed,
                })
            }
        }

        async delete(args: Prisma.CategoryDeleteArgs) {
            try {
                return await this.repo.delete({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.delete.title,
                    message: Repository.MESSAGES.delete.failed,
                })
            }
        }

        async deleteMany(args: Prisma.CategoryDeleteManyArgs) {
            try {
                return await this.repo.deleteMany({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.deleteMany.title,
                    message: Repository.MESSAGES.deleteMany.failed,
                })
            }
        }

        async checkExistsOrTrow(args: Prisma.CategoryFindFirstArgs) {
            await this.findFirstOrThrow(args)
        }

        async isExists(args: Prisma.CategoryFindFirstArgs) {
            return !!(await this.findFirst(args))
        }

        async findFirstOrThrow<Args extends Prisma.CategoryFindFirstArgs>(args: Args) {
            const category = await this.findFirst<Args>({ ...args })

            if (!category)
                throw new NotFoundException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.notFound,
                })

            return category as CategoryFindResponse<Args>
        }
        async findFirst<Args extends Prisma.CategoryFindFirstArgs>(args: Args) {
            try {
                return await this.repo.findFirst({ ...args }) as CategoryFindResponse<Args> | null
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.failed,
                })
            }
        }

        async findUniqueOrThrow<Args extends Prisma.CategoryFindUniqueArgs>(args: Args) {
            const category = await this.findUnique<Args>({ ...args })

            if (!category)
                throw new NotFoundException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.notFound,
                })

            return category as CategoryFindResponse<Args>
        }

        async findUnique<Args extends Prisma.CategoryFindUniqueArgs>(args: Args) {
            try {
                return await this.repo.findUnique({ ...args }) as CategoryFindResponse<Args> | null
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.failed,
                })
            }
        }

        async query<Args extends Prisma.CategoryFindManyArgs>(args: Args, page: { pageIndex: number, limite: number }) {
            const total = await this.count({ where: args.where })

            const categories = await this.findMany<Args>({
                ...args,
                skip: page.pageIndex * page.limite,
                take: page.limite
            })

            return {
                categories: categories as CategoryFindResponse<Args>[] || [],
                metadata: {
                    currentPage: page.pageIndex + 1,
                    itemsPerPage: page.limite,
                    totalItems: total,
                    totalPages: Math.ceil(total / page.limite),
                }
            }
        }

        async findMany<Args extends Prisma.CategoryFindManyArgs>(args: Args) {
            try {
                return await this.repo.findMany({ ...args }) as CategoryFindResponse<Args>[]
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.findMany.title,
                    message: Repository.MESSAGES.findMany.failed,
                })
            }
        }

        async count(args: Prisma.CategoryCountArgs) {
            try {
                return await this.repo.count({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.count.title,
                    message: Repository.MESSAGES.count.failed,
                })
            }
        }

        private get repo() { return this.database.instance.category }
    }

    export const categoryRepository = new Repository()
}