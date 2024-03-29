import { Injection, Service, Result } from '@core'
import { ID } from '@@types'
import { GLOBAL_DTO } from '@global'
import { UseCase } from '@common/use-case'
import { QuerySearchDTO } from '@services/query-search/global'
import { QuerySearchService } from '@services/query-search.service'
import { SchemaValidator } from '@services/validator.service'
import { CategoryRepository } from '@modules/category/category.repository'
import { GLOBAL_CATEGORY_DTO } from '@modules/category/category.global'

const schemaNumber = SchemaValidator.coerce.number()

export const schemaQuery = GLOBAL_DTO.query.schema().extend({
    bankAccountId: GLOBAL_CATEGORY_DTO.bankAccount.id,
    name: SchemaValidator.coerce.string().trim().optional(),
    color: SchemaValidator.coerce.string().trim().optional(),
    isFavorite: SchemaValidator.coerce.boolean().optional(),
})

export type CategoryFilterArgs = SchemaValidator.input<typeof schemaQuery>

export const schemaQueryAdmin = GLOBAL_DTO.query.schema(['id', 'bankAccountId', 'bankAccount', 'bankAccountCode', 'name', 'color', 'isFavorite', 'createdAt']).extend({
    id: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('id')).optional(),
    bankAccountId: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('bankAccountId')).optional(),
    bankAccount: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('bankAccount')).optional(),
    bankAccountCode: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('bankAccount')).optional(),
    name: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('name')).optional(),
    color: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('color')).optional(),
    isFavorite: SchemaValidator.object(QuerySearchDTO['BOOLEAN']['SCHEMA']('isFavorite')).optional(),
    createdAt: SchemaValidator.object(QuerySearchDTO['DATE']['SCHEMA']('createdAt')).optional(),
})

export type SchemaQueryFiltersType = SchemaValidator.input<typeof schemaQueryAdmin>

@Service({ name: 'category.use-case.query' })
export class CategoryQueryUseCase extends UseCase {
    constructor(
        @Injection.Inject('category.repository') private categoryRepository: CategoryRepository,
        @Injection.Inject('query-search') private querySearch: QuerySearchService,
    ) {
        super()
    }

    // Query method main
    async query(filtersArgs: SchemaQueryFiltersType) {
        const filters = this.validateFilterParamsDTO(filtersArgs, schemaQueryAdmin)

        const filtersQuery = this.querySearch.createFilter(filters, [
            { field: 'id', filter: 'id', type: 'NUMBER', typeOperation: 'SCHEMA' },
            { field: 'name', filter: 'name', type: 'STRING', typeOperation: 'SCHEMA' },
            { field: 'color', filter: 'color', type: 'STRING', typeOperation: 'SCHEMA' },
            { field: 'isFavorite', filter: 'isFavorite', type: 'BOOLEAN', typeOperation: 'SCHEMA' },
            { field: 'createdAt', filter: 'createdAt', type: 'DATE', typeOperation: 'SCHEMA' },
            { field: 'bankAccount.id', filter: 'bankAccountId', type: 'NUMBER', typeOperation: 'SCHEMA' },
            { field: 'bankAccount.name', filter: 'bankAccount', type: 'STRING', typeOperation: 'SCHEMA' },
            { field: 'bankAccount.code', filter: 'bankAccountCode', type: 'STRING', typeOperation: 'SCHEMA' },
        ])

        const ordersByQuery = this.querySearch.createOrderBy(filters.orderBy, [
            { field: 'id', filter: 'id' },
            { field: 'bankAccount.id', filter: 'bankAccountId' },
            { field: 'bankAccount.name', filter: 'bankAccount' },
            { field: 'bankAccount.code', filter: 'bankAccountCode' },
            { field: 'name', filter: 'name' },
            { field: 'color', filter: 'color' },
            { field: 'isFavorite', filter: 'isFavorite' },
            { field: 'createdAt', filter: 'createdAt' },
        ], [{ id: 'desc' }])

        const result = await this.categoryRepository.query({
            where: { ...filtersQuery },
            orderBy: [...ordersByQuery]
        }, filters)

        if (!result.isSuccess()) {
            return Result.failure({ ...result.getError() })
        }

        return Result.success({
            ...result.getValue(),
        })
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
