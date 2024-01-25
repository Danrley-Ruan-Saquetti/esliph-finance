import { Injection, Service, Result } from '@core'
import { ID } from '@@types'
import { GLOBAL_DTO } from '@global'
import { isUndefined } from '@util'
import { UseCase } from '@common/use-case'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { CategoryRepository } from '@modules/category/category.repository'
import { GLOBAL_CATEGORY_DTO } from '@modules/category/category.global'

const schemaNumber = ValidatorService.schema.coerce.number()
export const schemaQuery = ValidatorService.schema.object({
    bankAccountId: GLOBAL_CATEGORY_DTO.bankAccount.id,
    pageIndex: GLOBAL_DTO.query.pagination.pageIndex(),
    limite: GLOBAL_DTO.query.pagination.limite(),
    name: ValidatorService.schema.coerce.string().trim().optional(),
    color: ValidatorService.schema.coerce.string().trim().optional(),
    isFavorite: ValidatorService.schema.coerce.boolean().optional(),
})

export type CategoryFilterArgs = SchemaValidator.input<typeof schemaQuery>

@Service({ name: 'category.use-case.query' })
export class CategoryQueryUseCase extends UseCase {
    constructor(@Injection.Inject('category.repository') private categoryRepository: CategoryRepository) {
        super()
    }

    // Query method main
    async queryMany(filters: CategoryFilterArgs) {
        const { limite, pageIndex, bankAccountId, color, isFavorite, name } = this.validateDTO(filters, schemaQuery)

        const filtersQuery = {
            bankAccountId,
            ...(color && { color: { contains: color, mode: 'insensitive' as any } }),
            ...(isFavorite && { isFavorite }),
            ...(name && { name: { contains: name, mode: 'insensitive' as any } }),
        }

        const totalResult = await this.categoryRepository.count({
            where: { ...filtersQuery }
        })

        if (!totalResult.isSuccess()) {
            return Result.failure({ ...totalResult.getError(), title: 'Count Categories' })
        }

        const categoriesResult = await this.categoryRepository.findMany({
            where: { ...filtersQuery },
            orderBy: [{ isFavorite: 'desc' }, { name: 'asc' }],
            skip: pageIndex * limite,
            take: limite
        })

        if (!categoriesResult.isSuccess()) {
            return Result.failure({ ...categoriesResult.getError(), title: 'Query Financial Transactions' })
        }

        const result = {
            categories: categoriesResult.getValue() || [],
            metadata: {
                currentPage: pageIndex,
                itemsPerPage: limite,
                totalOfItens: totalResult.getValue(),
                totalOfPages: Math.ceil(totalResult.getValue() / limite),
            },
            filtersQuery
        }

        return Result.success(result)
    }

    async queryById(args: { id: ID }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const categoryResult = await this.categoryRepository.findUnique({ where: { id } })

        if (!categoryResult.isSuccess()) {
            return Result.failure({ ...categoryResult.getError(), title: 'Query Category' })
        }

        return Result.success(categoryResult.getValue())
    }

    async queryByIdAndBankAccountId(args: { id: ID, bankAccountId: ID }) {
        const id = this.validateDTO(args.id, schemaNumber)
        const bankAccountId = this.validateDTO(args.bankAccountId, schemaNumber)

        const categoryResult = await this.categoryRepository.findUnique({ where: { id, bankAccountId } })

        if (!categoryResult.isSuccess()) {
            return Result.failure({ ...categoryResult.getError(), title: 'Query Category' })
        }

        return Result.success(categoryResult.getValue())
    }

    async queryManyByBankAccountId(args: { bankAccountId: ID }) {
        const bankAccountId = this.validateDTO(args.bankAccountId, schemaNumber)

        const categoriesResult = await this.categoryRepository.findMany({ where: { bankAccountId } })

        if (!categoriesResult.isSuccess()) {
            return Result.failure({ ...categoriesResult.getError(), title: 'Query Categories' })
        }

        return Result.success(categoriesResult.getValue() || [])
    }
}
