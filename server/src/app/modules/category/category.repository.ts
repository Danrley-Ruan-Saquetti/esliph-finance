import { Prisma } from '@services/database.service'
import { Service } from '@core'
import { MetadataQuery } from '@@types'
import { Repository } from '@services/repository.service'

type CategoryGetPayloadTypes = boolean | null | undefined | { select?: Prisma.CategorySelect | null }
type CategoryGetPayload<T extends boolean | null | undefined | { select?: Prisma.CategorySelect | null }> = Prisma.CategoryGetPayload<T>
type CategoryPropSelect<ArgsSelect extends CategoryGetPayloadTypes> = CategoryGetPayload<ArgsSelect>
type CategoryFindResponse<ArgsSelect extends CategoryGetPayloadTypes> = CategoryPropSelect<ArgsSelect>

@Service({ name: 'category.repository' })
export class CategoryRepository extends Repository {
    private static GLOBAL_MESSAGE = {
        create: {
            title: 'Register Category',
            success: 'Category successfully registered',
            failed: 'Failed to register category'
        },
        remove: {
            title: 'Remove Category',
            success: 'Category successfully removed',
            failed: 'Failed to remove category'
        },
        update: {
            title: 'Update Category',
            success: 'Category successfully updated',
            failed: 'Failed to update category data'
        },
        find: {
            title: 'Find Category',
            notFound: 'Category not found',
            failed: 'Unable to query category'
        },
        findMany: {
            title: 'Find Categories',
            failed: 'Unable to query categories'
        },
        count: {
            title: 'Count Categories',
            failed: 'Unable to count categories'
        }
    }

    async create(args: { data: Prisma.CategoryCreateInput }) {
        try {
            await this.database.instance.category.create({ ...args })

            return this.handleResponse<{ message: string }>({ message: CategoryRepository.GLOBAL_MESSAGE.create.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: CategoryRepository.GLOBAL_MESSAGE.create.title, message: CategoryRepository.GLOBAL_MESSAGE.create.failed }
            })
        }
    }

    async update(args: { where: Prisma.CategoryWhereUniqueInput, data: Prisma.CategoryUpdateInput }) {
        try {
            await this.database.instance.category.update({ ...args })

            return this.handleResponse<{ message: string }>({ message: CategoryRepository.GLOBAL_MESSAGE.update.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: CategoryRepository.GLOBAL_MESSAGE.update.title, message: CategoryRepository.GLOBAL_MESSAGE.update.failed }
            })
        }
    }

    async delete(args: { where: Prisma.CategoryWhereUniqueInput }) {
        try {
            await this.database.instance.category.delete({ ...args })

            return this.handleResponse<{ message: string }>({ message: CategoryRepository.GLOBAL_MESSAGE.remove.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: CategoryRepository.GLOBAL_MESSAGE.remove.title, message: CategoryRepository.GLOBAL_MESSAGE.remove.failed }
            })
        }
    }

    async findFirst<Args extends Prisma.CategoryFindFirstArgs>(args: Args) {
        try {
            const category = await this.database.instance.category.findFirst(args) as CategoryFindResponse<Args>

            return this.handleResponse<CategoryFindResponse<Args>>(category, {
                noAcceptNullable: true,
                error: { title: CategoryRepository.GLOBAL_MESSAGE.find.title, message: CategoryRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<CategoryFindResponse<Args>>(err, {
                error: { title: CategoryRepository.GLOBAL_MESSAGE.find.title, message: CategoryRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findUnique<Args extends Prisma.CategoryFindUniqueArgs>(args: Args) {
        try {
            const category = await this.database.instance.category.findUnique(args) as CategoryFindResponse<Args>

            return this.handleResponse<CategoryFindResponse<Args>>(category, {
                noAcceptNullable: true,
                error: { title: CategoryRepository.GLOBAL_MESSAGE.find.title, message: CategoryRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<CategoryFindResponse<Args>>(err, {
                error: { title: CategoryRepository.GLOBAL_MESSAGE.find.title, message: CategoryRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async query<Args extends Prisma.CategoryFindManyArgs>(args: Args, page: { pageIndex: number, limite: number }) {
        const totalResult = await this.count({
            where: { ...args.where }
        })

        if (!totalResult.isSuccess()) {
            return this.handleError<{ categories: CategoryFindResponse<Args>[], metadata: MetadataQuery }>(totalResult.getError(), {
                error: {
                    title: CategoryRepository.GLOBAL_MESSAGE.findMany.title,
                    message: CategoryRepository.GLOBAL_MESSAGE.findMany.failed
                }
            })
        }

        const categoriesResult = await this.findMany({
            ...args,
            skip: page.pageIndex * page.limite,
            take: page.limite
        })

        if (!categoriesResult.isSuccess()) {
            return this.handleError<{ categories: CategoryFindResponse<Args>[], metadata: MetadataQuery }>(totalResult.getError(), {
                error: {
                    title: CategoryRepository.GLOBAL_MESSAGE.findMany.title,
                    message: CategoryRepository.GLOBAL_MESSAGE.findMany.failed
                }
            })
        }

        const result = {
            categories: categoriesResult.getValue() || [],
            metadata: {
                currentPage: page.pageIndex + 1,
                itemsPerPage: page.limite,
                totalOfItens: totalResult.getValue(),
                totalOfPages: Math.ceil(totalResult.getValue() / page.limite),
            }
        }

        return this.handleResponse<{ categories: CategoryFindResponse<Args>[], metadata: MetadataQuery }>(result as any)
    }

    async findMany<Args extends Prisma.CategoryFindManyArgs>(args: Args) {
        try {
            const category = await this.database.instance.category.findMany(args) as CategoryFindResponse<Args>[]

            return this.handleResponse<CategoryFindResponse<Args>[]>(category, {
                noAcceptNullable: true,
                error: { title: CategoryRepository.GLOBAL_MESSAGE.find.title, message: CategoryRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<CategoryFindResponse<Args>[]>(err, {
                error: { title: CategoryRepository.GLOBAL_MESSAGE.find.title, message: CategoryRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async count(args: Prisma.CategoryCountArgs) {
        try {
            const financialTransaction = await this.database.instance.category.count(args)

            return this.handleResponse<number>(financialTransaction)
        } catch (err: any) {
            return this.handleError<number>(err, {
                error: { title: CategoryRepository.GLOBAL_MESSAGE.find.title, message: CategoryRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }
}
