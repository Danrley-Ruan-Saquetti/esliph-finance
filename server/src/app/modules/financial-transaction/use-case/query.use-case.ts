import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { Result } from '@esliph/common'
import { ID } from '@@types'
import { GLOBAL_DTO } from '@global'
import { UseCase } from '@common/use-case'
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
    expireStart: ValidatorService.schema.coerce.date().optional(),
    expireEnd: ValidatorService.schema.coerce.date().optional(),
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

@Service({ name: 'financial-transaction.use-case.query' })
export class FinancialTransactionQueryUseCase extends UseCase {
    constructor(@Injection.Inject('financial-transaction.repository') private transactionRepository: FinancialTransactionRepository) {
        super()
    }

    // Query method main
    async queryManyByBankAccountIdWithCategories(filters: FinancialTransactionFilterArgs) {
        const { bankAccountId, type, limite, pageIndex, categoryId, expireEnd, expireStart, situation, frequency, typeOccurrence, title } = this.validateDTO(filters, schemaQuery)

        const filtersQuery = {
            bankAccountId,
            ...(categoryId && { categories: { some: { categoryId } } }),
            expiresIn: { ...(expireStart && { gte: expireStart }), ...(expireEnd && { lte: expireEnd }) },
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
            pageIndex,
            limite,
            total: totalResult.getValue()
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
