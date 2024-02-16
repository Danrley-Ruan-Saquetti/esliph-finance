import { Injection, Service, Result } from '@core'
import { ID } from '@@types'
import { GLOBAL_DTO } from '@global'
import { UseCase } from '@common/use-case'
import { QuerySearchDTO, QuerySearchService } from '@services/query-search.service'
import { ValidatorService, SchemaValidator } from '@services/validator.service'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { GLOBAL_FINANCIAL_TRANSACTION_DTO } from '@modules/financial-transaction/financial-transaction.global'

const schemaNumber = ValidatorService.schema.coerce.number()
export const schemaQuery = ValidatorService.schema.object({
    bankAccountId: GLOBAL_FINANCIAL_TRANSACTION_DTO.bankAccount.id,
    pageIndex: GLOBAL_DTO.query.pagination.pageIndex(),
    limite: GLOBAL_DTO.query.pagination.limite(),
    categoryId: ValidatorService.schema.coerce.number().optional(),
    title: ValidatorService.schema.coerce.string().trim().optional(),
    expiresStart: ValidatorService.schema.coerce.date().optional(),
    expiresEnd: ValidatorService.schema.coerce.date().optional(),
    competenceStart: ValidatorService.schema.coerce.date().optional(),
    competenceEnd: ValidatorService.schema.coerce.date().optional(),
    type: ValidatorService.schema
        .enum(GLOBAL_FINANCIAL_TRANSACTION_DTO.type.enum, {
            errorMap: () => ({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.type.messageEnumInvalid }),
        }).optional(),
    situation: ValidatorService.schema
        .enum(GLOBAL_FINANCIAL_TRANSACTION_DTO.situation.enum, {
            errorMap: () => ({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.situation.messageEnumInvalid }),
        }).optional(),
    frequency: ValidatorService.schema
        .enum(GLOBAL_FINANCIAL_TRANSACTION_DTO.frequency.enum, {
            errorMap: () => ({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.frequency.messageEnumInvalid }),
        }).optional(),
    typeOccurrence: ValidatorService.schema
        .enum(GLOBAL_FINANCIAL_TRANSACTION_DTO.typeOccurrence.enum, {
            errorMap: () => ({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.typeOccurrence.messageEnumInvalid }),
        }).optional(),
})

export type FinancialTransactionFilterArgs = SchemaValidator.input<typeof schemaQuery>

const schema = SchemaValidator.object({
    id: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('id')).optional(),
    bankAccountId: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('bankAccountId')).optional(),
    pageIndex: GLOBAL_DTO.query.pagination.pageIndex(),
    limite: GLOBAL_DTO.query.pagination.limite(),
    category: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('category')).optional(),
    categoryId: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('categoryId')).optional(),
    title: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('title')).optional(),
    peopleId: SchemaValidator.object(QuerySearchDTO['NUMBER']['SCHEMA']('peopleId')).optional(),
    itinCnpj: SchemaValidator.object(QuerySearchDTO['STRING']['SCHEMA']('itinCnpj')).optional(),
    expiresAt: SchemaValidator.object(QuerySearchDTO['DATE']['SCHEMA']('expiresAt')).optional(),
    competenceAt: SchemaValidator.object(QuerySearchDTO['DATE']['SCHEMA']('competenceAt')).optional(),
    type: QuerySearchDTO['ENUM']['MANY_VALUES'](GLOBAL_FINANCIAL_TRANSACTION_DTO.typeOccurrence.enum, 'type').optional(),
    situation: QuerySearchDTO['ENUM']['MANY_VALUES'](GLOBAL_FINANCIAL_TRANSACTION_DTO.situation.enum, 'situation').optional(),
    frequency: QuerySearchDTO['ENUM']['MANY_VALUES'](GLOBAL_FINANCIAL_TRANSACTION_DTO.frequency.enum, 'frequency').optional(),
    typeOccurrence: QuerySearchDTO['ENUM']['MANY_VALUES'](GLOBAL_FINANCIAL_TRANSACTION_DTO.typeOccurrence.enum, 'typeOccurrence').optional(),
})

export type SchemaQueryFiltersType = SchemaValidator.input<typeof schema>

@Service({ name: 'financial-transaction.use-case.query' })
export class FinancialTransactionQueryUseCase extends UseCase {
    constructor(
        @Injection.Inject('financial-transaction.repository') private transactionRepository: FinancialTransactionRepository,
        @Injection.Inject('query-search') private querySearch: QuerySearchService,
    ) {
        super()
    }

    async query(filtersArgs: SchemaQueryFiltersType) {
        const filters = this.validateFilterParamsDTO(filtersArgs, schema)

        const filtersCreate = this.querySearch.createFilter(filters, [
            { field: 'id', filter: 'id', type: 'NUMBER', typeOperation: 'SCHEMA' },
            { field: 'title', filter: 'title', type: 'STRING', typeOperation: 'SCHEMA' },
            { field: 'expiresIn', filter: 'expiresAt', type: 'DATE', typeOperation: 'SCHEMA' },
            { field: 'dateTimeCompetence', filter: 'competenceAt', type: 'DATE', typeOperation: 'SCHEMA' },
            { field: 'categories.some.category.id', filter: 'categoryId', type: 'NUMBER', typeOperation: 'SCHEMA' },
            { field: 'type', filter: 'type', type: 'ENUM', typeOperation: 'MANY_VALUES' },
            { field: 'categories.some.category.name', filter: 'category', type: 'STRING', typeOperation: 'SCHEMA' },
            { field: 'typeOccurrence', filter: 'typeOccurrence', type: 'ENUM', typeOperation: 'MANY_VALUES' },
            { field: 'frequency.in', filter: 'frequency', type: 'ENUM', typeOperation: 'MANY_VALUES' },
            { field: 'bankAccount.id', filter: 'bankAccountId', type: 'NUMBER', typeOperation: 'SCHEMA' },
            { field: 'bankAccount.people.id', filter: 'peopleId', type: 'NUMBER', typeOperation: 'SCHEMA' },
            { field: 'bankAccount.people.itinCnpj', filter: 'itinCnpj', type: 'STRING', typeOperation: 'SCHEMA' },
        ])

        const totalResult = await this.transactionRepository.count({
            where: { ...filtersCreate }
        })

        if (!totalResult.isSuccess()) {
            return Result.failure({ ...totalResult.getError(), title: 'Count Financial Transactions' })
        }

        const financialTransactionsResult = await this.transactionRepository.findMany({
            where: { ...filtersCreate },
            include: { categories: { select: { category: true } } },
            orderBy: { expiresIn: 'desc' },
            skip: filters.pageIndex * filters.limite,
            take: filters.limite
        })

        if (!financialTransactionsResult.isSuccess()) {
            return Result.failure({ ...financialTransactionsResult.getError(), title: 'Query Financial Transactions' })
        }

        const result = {
            financialTransactions: financialTransactionsResult.getValue().map(transaction => ({ ...transaction, categories: transaction.categories.map(({ category }) => category) })) || [],
            metadata: {
                currentPage: filters.pageIndex,
                itemsPerPage: filters.limite,
                totalOfItens: totalResult.getValue(),
                totalOfPages: Math.ceil(totalResult.getValue() / filters.limite),
            }
        }

        return Result.success(result)
    }

    // Query method main
    async queryManyByBankAccountIdWithCategories(filtersArgs: FinancialTransactionFilterArgs) {
        const { competenceStart, competenceEnd, bankAccountId, type, limite, pageIndex, categoryId, expiresEnd, expiresStart, situation, frequency, typeOccurrence, title } = this.validateDTO(filtersArgs, schemaQuery)

        const filtersQuery = {
            bankAccountId,
            ...(categoryId && { categories: { some: { categoryId } } }),
            expiresIn: { ...(expiresStart && { gte: expiresStart }), ...(expiresEnd && { lte: expiresEnd }) },
            dateTimeCompetence: { ...(competenceStart && { gte: competenceStart }), ...(competenceEnd && { lte: competenceEnd }) },
            ...(situation && { situation }),
            ...(frequency && { frequency }),
            ...(type && { type }),
            ...(typeOccurrence && { typeOccurrence }),
            ...(title && { title: { contains: title, mode: 'insensitive' as any } }),
        }

        const totalResult = await this.transactionRepository.count({
            where: { ...filtersQuery }
        })

        if (!totalResult.isSuccess()) {
            return Result.failure({ ...totalResult.getError(), title: 'Count Financial Transactions' })
        }

        const financialTransactionsResult = await this.transactionRepository.findMany({
            where: { ...filtersQuery },
            include: { categories: { select: { category: true } } },
            orderBy: { expiresIn: 'desc' },
            skip: pageIndex * limite,
            take: limite
        })

        if (!financialTransactionsResult.isSuccess()) {
            return Result.failure({ ...financialTransactionsResult.getError(), title: 'Query Financial Transactions' })
        }

        const result = {
            financialTransactions: financialTransactionsResult.getValue().map(transaction => ({ ...transaction, categories: transaction.categories.map(({ category }) => category) })) || [],
            metadata: {
                currentPage: pageIndex,
                itemsPerPage: limite,
                totalOfItens: totalResult.getValue(),
                totalOfPages: Math.ceil(totalResult.getValue() / limite),
            }
        }

        return Result.success(result)
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
