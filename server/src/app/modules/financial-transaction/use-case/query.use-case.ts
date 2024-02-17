import { Injection, Service, Result } from '@core'
import { ID } from '@@types'
import { GLOBAL_DTO } from '@global'
import { UseCase } from '@common/use-case'
import { QuerySearchDTO, QuerySearchService } from '@services/query-search.service'
import { ValidatorService, SchemaValidator } from '@services/validator.service'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { GLOBAL_FINANCIAL_TRANSACTION_DTO } from '@modules/financial-transaction/financial-transaction.global'

const schemaNumber = ValidatorService.schema.coerce.number()
export const schemaQueryCustomer = ValidatorService.schema.object({
    bankAccountId: QuerySearchDTO['NUMBER']['UNIQUE']('bankAccountId'),
    id: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('id')).optional(),
    pageIndex: GLOBAL_DTO.query.pagination.pageIndex(),
    limite: GLOBAL_DTO.query.pagination.limite(),
    category: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('category')).optional(),
    categoryId: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('categoryId')).optional(),
    title: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('title')).optional(),
    expiresAt: SchemaValidator.object(QuerySearchDTO['DATE']['SCHEMA']('expiresAt')).optional(),
    competenceAt: SchemaValidator.object(QuerySearchDTO['DATE']['SCHEMA']('competenceAt')).optional(),
    type: QuerySearchDTO['ENUM']['MANY_VALUES'](GLOBAL_FINANCIAL_TRANSACTION_DTO.typeOccurrence.enum, 'type').optional(),
    situation: SchemaValidator.object(QuerySearchDTO['ENUM']['SCHEMA'](GLOBAL_FINANCIAL_TRANSACTION_DTO.situation.enum, 'situation')).optional(),
    frequency: SchemaValidator.object(QuerySearchDTO['ENUM']['SCHEMA'](GLOBAL_FINANCIAL_TRANSACTION_DTO.frequency.enum, 'frequency')).optional(),
    typeOccurrence: SchemaValidator.object(QuerySearchDTO['ENUM']['SCHEMA'](GLOBAL_FINANCIAL_TRANSACTION_DTO.typeOccurrence.enum, 'typeOccurrence')).optional(),
})

export type FinancialTransactionFilterArgs = SchemaValidator.input<typeof schemaQueryCustomer>

const schemaQueryAdmin = SchemaValidator.object({
    pageIndex: GLOBAL_DTO.query.pagination.pageIndex(),
    limite: GLOBAL_DTO.query.pagination.limite(),
    id: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('id')).optional(),
    bankAccountId: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('bankAccountId')).optional(),
    bankAccount: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('bankAccount')).optional(),
    bankAccountCode: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('bankAccountCode')).optional(),
    category: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('category')).optional(),
    categoryId: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('categoryId')).optional(),
    title: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('title')).optional(),
    peopleId: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('peopleId')).optional(),
    people: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('people')).optional(),
    itinCnpj: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('itinCnpj')).optional(),
    expiresAt: SchemaValidator.object(QuerySearchDTO['DATE']['SCHEMA']('expiresAt')).optional(),
    competenceAt: SchemaValidator.object(QuerySearchDTO['DATE']['SCHEMA']('competenceAt')).optional(),
    type: SchemaValidator.object(QuerySearchDTO['ENUM']['SCHEMA'](GLOBAL_FINANCIAL_TRANSACTION_DTO.type.enum, 'type')).optional(),
    situation: SchemaValidator.object(QuerySearchDTO['ENUM']['SCHEMA'](GLOBAL_FINANCIAL_TRANSACTION_DTO.situation.enum, 'situation')).optional(),
    frequency: SchemaValidator.object(QuerySearchDTO['ENUM']['SCHEMA'](GLOBAL_FINANCIAL_TRANSACTION_DTO.frequency.enum, 'frequency')).optional(),
    typeOccurrence: SchemaValidator.object(QuerySearchDTO['ENUM']['SCHEMA'](GLOBAL_FINANCIAL_TRANSACTION_DTO.typeOccurrence.enum, 'typeOccurrence')).optional(),
})

export type SchemaQueryFiltersType = SchemaValidator.input<typeof schemaQueryAdmin>

@Service({ name: 'financial-transaction.use-case.query' })
export class FinancialTransactionQueryUseCase extends UseCase {
    constructor(
        @Injection.Inject('financial-transaction.repository') private transactionRepository: FinancialTransactionRepository,
        @Injection.Inject('query-search') private querySearch: QuerySearchService,
    ) {
        super()
    }

    // Query method main
    async query(filtersArgs: SchemaQueryFiltersType) {
        const filters = this.validateFilterParamsDTO(filtersArgs, schemaQueryAdmin)

        const filtersQuery = this.querySearch.createFilter(filters, [
            { field: 'id', filter: 'id', type: 'NUMBER', typeOperation: 'SCHEMA' },
            { field: 'title', filter: 'title', type: 'STRING', typeOperation: 'SCHEMA' },
            { field: 'expiresIn', filter: 'expiresAt', type: 'DATE', typeOperation: 'SCHEMA' },
            { field: 'dateTimeCompetence', filter: 'competenceAt', type: 'DATE', typeOperation: 'SCHEMA' },
            { field: 'type', filter: 'type', type: 'ENUM', typeOperation: 'SCHEMA' },
            { field: 'typeOccurrence', filter: 'typeOccurrence', type: 'ENUM', typeOperation: 'SCHEMA' },
            { field: 'situation', filter: 'situation', type: 'ENUM', typeOperation: 'SCHEMA' },
            { field: 'frequency', filter: 'frequency', type: 'ENUM', typeOperation: 'SCHEMA' },
            { field: 'bankAccount.id', filter: 'bankAccountId', type: 'NUMBER', typeOperation: 'SCHEMA' },
            { field: 'bankAccount.name', filter: 'bankAccount', type: 'STRING', typeOperation: 'SCHEMA' },
            { field: 'bankAccount.code', filter: 'bankAccountCode', type: 'STRING', typeOperation: 'SCHEMA' },
            { field: 'bankAccount.people.id', filter: 'peopleId', type: 'NUMBER', typeOperation: 'SCHEMA' },
            { field: 'bankAccount.people.itinCnpj', filter: 'itinCnpj', type: 'STRING', typeOperation: 'SCHEMA' },
            { field: 'bankAccount.people.name', filter: 'people', type: 'STRING', typeOperation: 'SCHEMA' },
            { field: 'categories.some.category.name', filter: 'category', type: 'STRING', typeOperation: 'SCHEMA' },
            { field: 'categories.some.category.id', filter: 'categoryId', type: 'NUMBER', typeOperation: 'SCHEMA' },
        ])

        const result = await this.transactionRepository.query({
            where: { ...filtersQuery },
            include: { categories: { select: { category: true } } },
            orderBy: { expiresIn: 'desc' },
        }, filters)

        if (!result.isSuccess()) {
            return Result.failure({ ...result.getError() })
        }

        return Result.success({
            ...result.getValue(),
            financialTransactions: result.getValue()
                .financialTransactions
                .map(transaction => ({
                    ...transaction,
                    categories: transaction.categories.map(({ category }) => category)
                })) || [],
        })
    }

    // Query method customer
    async queryManyByBankAccountIdWithCategories(filtersArgs: FinancialTransactionFilterArgs) {
        const filters = this.validateDTO(filtersArgs, schemaQueryCustomer)

        const filtersQuery = this.querySearch.createFilter(filters, [
            { field: 'id', filter: 'id', type: 'NUMBER', typeOperation: 'SCHEMA' },
            { field: 'title', filter: 'title', type: 'STRING', typeOperation: 'SCHEMA' },
            { field: 'expiresIn', filter: 'expiresAt', type: 'DATE', typeOperation: 'SCHEMA' },
            { field: 'dateTimeCompetence', filter: 'competenceAt', type: 'DATE', typeOperation: 'SCHEMA' },
            { field: 'categories.some.category.id', filter: 'categoryId', type: 'NUMBER', typeOperation: 'SCHEMA' },
            { field: 'type', filter: 'type', type: 'ENUM', typeOperation: 'SCHEMA' },
            { field: 'typeOccurrence', filter: 'typeOccurrence', type: 'ENUM', typeOperation: 'SCHEMA' },
            { field: 'situation', filter: 'situation', type: 'ENUM', typeOperation: 'SCHEMA' },
            { field: 'frequency', filter: 'frequency', type: 'ENUM', typeOperation: 'SCHEMA' },
            { field: 'categories.some.category.name', filter: 'category', type: 'STRING', typeOperation: 'SCHEMA' },
            { field: 'bankAccount.id', filter: 'bankAccountId', type: 'NUMBER', typeOperation: 'UNIQUE' },
        ])

        const result = await this.transactionRepository.query({
            where: { ...filtersQuery },
            include: { categories: { select: { category: true } } },
            orderBy: { expiresIn: 'desc' },
        }, filters)

        if (!result.isSuccess()) {
            return Result.failure({ ...result.getError() })
        }

        return Result.success({
            ...result.getValue(),
            financialTransactions: result.getValue()
                .financialTransactions
                .map(transaction => ({
                    ...transaction,
                    categories: transaction.categories.map(({ category }) => category)
                })) || [],
        })
    }

    async queryByIdWithNotes(args: { id: ID }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const financialTransactionsResult = await this.transactionRepository.findUnique({
            where: { id },
            include: { notes: true },
            orderBy: { expiresIn: 'desc' }
        })

        if (!financialTransactionsResult.isSuccess()) {
            return Result.failure({ ...financialTransactionsResult.getError(), title: 'Query Financial Transaction' })
        }

        return Result.success(financialTransactionsResult.getValue())
    }

    async queryByIdWithNotesAndPaymentsAndCategories(args: { id: ID }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const financialTransactionsResult = await this.transactionRepository.findUnique({
            where: { id },
            include: { notes: true, payments: true, categories: true },
            orderBy: { expiresIn: 'desc' }
        })

        if (!financialTransactionsResult.isSuccess()) {
            return Result.failure({ ...financialTransactionsResult.getError(), title: 'Query Financial Transaction' })
        }

        return Result.success(financialTransactionsResult.getValue())
    }

    async queryManyByBankAccountIdAndCategoryIdWithCategories(args: { bankAccountId: ID, categoryId: ID }) {
        const bankAccountId = this.validateDTO(args.bankAccountId, schemaNumber)
        const categoryId = this.validateDTO(args.categoryId, schemaNumber)

        const financialTransactionsResult = await this.transactionRepository.findMany({
            where: { bankAccountId, categories: { some: { categoryId } } },
            include: {
                categories: {
                    select: { category: true }
                }
            },
            orderBy: { expiresIn: 'desc' }
        })

        if (!financialTransactionsResult.isSuccess()) {
            return Result.failure({ ...financialTransactionsResult.getError(), title: 'Query Financial Transactions' })
        }

        return Result.success(financialTransactionsResult.getValue() || [])
    }
}
