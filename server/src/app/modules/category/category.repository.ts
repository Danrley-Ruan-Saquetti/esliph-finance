import { Service } from '@esliph/module'
import { ID } from '@@types'
import { Repository } from '@services/repository.service'
import { CategoryModel } from '@modules/category/category.model'

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
        }
    }

    async register({ bankAccountId, color, isFavorite, name }: CategoryModel.Model) {
        try {
            await this.database.instance.category.create({ data: { bankAccountId, color, isFavorite, name } })

            return this.handleResponse<{ message: string }>({ message: CategoryRepository.GLOBAL_MESSAGE.create.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: CategoryRepository.GLOBAL_MESSAGE.create.title, message: CategoryRepository.GLOBAL_MESSAGE.create.failed }
            })
        }
    }

    async updateById(args: CategoryModel.UpdateArgs, where: { id: number }) {
        try {
            await this.database.instance.category.update({ where: { id: where.id }, data: args })

            return this.handleResponse<{ message: string }>({ message: CategoryRepository.GLOBAL_MESSAGE.update.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: CategoryRepository.GLOBAL_MESSAGE.update.title, message: CategoryRepository.GLOBAL_MESSAGE.update.failed }
            })
        }
    }

    async removeById(where: { id: number }) {
        try {
            await this.database.instance.category.delete({ where: { id: where.id } })

            return this.handleResponse<{ message: string }>({ message: CategoryRepository.GLOBAL_MESSAGE.remove.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: CategoryRepository.GLOBAL_MESSAGE.remove.title, message: CategoryRepository.GLOBAL_MESSAGE.remove.failed }
            })
        }
    }

    async findById(id: ID) {
        try {
            const category = await this.database.instance.category.findFirst({ where: { id } })

            return this.handleResponse<CategoryModel.Category>(category, {
                noAcceptNullable: true,
                error: { title: CategoryRepository.GLOBAL_MESSAGE.find.title, message: CategoryRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<CategoryModel.Category>(err, {
                error: { title: CategoryRepository.GLOBAL_MESSAGE.find.title, message: CategoryRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findByIdAndBankAccountId(id: ID, bankAccountId: ID) {
        try {
            const category = await this.database.instance.category.findFirst({ where: { id, bankAccountId } })

            return this.handleResponse<CategoryModel.Category>(category, {
                noAcceptNullable: true,
                error: { title: CategoryRepository.GLOBAL_MESSAGE.find.title, message: CategoryRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<CategoryModel.Category>(err, {
                error: { title: CategoryRepository.GLOBAL_MESSAGE.find.title, message: CategoryRepository.GLOBAL_MESSAGE.find.failed },
            })
        }
    }

    async findManyByBankAccountId(bankAccountId: ID) {
        try {
            const users = await this.database.instance.category.findMany({ where: { bankAccountId } })

            return this.handleResponse<CategoryModel.Category[]>(users)
        } catch (err: any) {
            return this.handleError<CategoryModel.Category[]>(err, {
                error: { title: CategoryRepository.GLOBAL_MESSAGE.findMany.title, message: CategoryRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findManyByBankAccountIdOrderIsFavorite(bankAccountId: ID) {
        try {
            const users = await this.database.instance.category.findMany({ where: { bankAccountId }, orderBy: { isFavorite: 'asc' } })

            return this.handleResponse<CategoryModel.Category[]>(users)
        } catch (err: any) {
            return this.handleError<CategoryModel.Category[]>(err, {
                error: { title: CategoryRepository.GLOBAL_MESSAGE.findMany.title, message: CategoryRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }
}
