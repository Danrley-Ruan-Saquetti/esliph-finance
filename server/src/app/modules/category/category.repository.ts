import { Service } from '@esliph/module'
import { ID } from '@@types'
import { Repository } from '@services/repository.service'
import { CategoryModel } from '@modules/category/category.model'

@Service({ name: 'category.repository' })
export class CategoryRepository extends Repository {
    async register({ bankAccountId, color, isFavorite, name }: CategoryModel.Model) {
        try {
            await this.database.instance.category.create({ data: { bankAccountId, color, isFavorite, name } })

            return this.handleResponse<{ message: string }>(
                { message: 'Category successfully registered' },
                { error: { title: 'Register Category', message: 'Category successfully registered' } },
            )
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, { error: { title: 'Register Category', message: 'Unable to register category' } })
        }
    }

    async updateById(args: CategoryModel.Model, where: { id: number }) {
        try {
            await this.database.instance.category.update({ where: { id: where.id }, data: args })

            return this.handleResponse<{ message: string }>(
                { message: 'Category successfully updated' },
                { error: { title: 'Update Category', message: 'Category successfully updated' } },
            )
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, { error: { title: 'Update Category', message: 'Unable to update category' } })
        }
    }

    async findById(id: ID) {
        try {
            const category = await this.database.instance.category.findFirst({ where: { id } })

            return this.handleResponse<CategoryModel.Category>(category, {
                noAcceptNullable: true,
                error: { title: 'Find Category', message: 'Category not found' },
            })
        } catch (err: any) {
            return this.handleError<CategoryModel.Category>(err, { error: { title: 'Find Category', message: 'Category not found' } })
        }
    }

    async findManyByBankAccountId(bankAccountId: ID) {
        try {
            const users = await this.database.instance.category.findMany({ where: { bankAccountId } })

            return this.handleResponse<CategoryModel.Category[]>(users, { error: { title: 'Find Category', message: 'Category not found' } })
        } catch (err: any) {
            return this.handleError<CategoryModel.Category[]>(err, { error: { title: 'Find Category', message: 'Unable to find category' } })
        }
    }

    async findManyByBankAccountIdOrderIsFavorite(bankAccountId: ID) {
        try {
            const users = await this.database.instance.category.findMany({ where: { bankAccountId }, orderBy: { isFavorite: 'asc' } })

            return this.handleResponse<CategoryModel.Category[]>(users, { error: { title: 'Find Category', message: 'Category not found' } })
        } catch (err: any) {
            return this.handleError<CategoryModel.Category[]>(err, { error: { title: 'Find Category', message: 'Unable to find category' } })
        }
    }
}
