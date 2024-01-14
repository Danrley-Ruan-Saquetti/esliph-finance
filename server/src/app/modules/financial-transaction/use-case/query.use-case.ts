import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { Result } from '@esliph/common'
import { ID } from '@@types'
import { GLOBAL_DTO } from '@global'
import { UseCase } from '@common/use-case'
import { ValidatorService, SchemaValidator } from '@services/validator.service'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'

const schemaNumber = ValidatorService.schema.coerce.number()
const schemaQuery = ValidatorService.schema.object({
    pageIndex: GLOBAL_DTO.query.pagination.pageIndex(),
    limite: GLOBAL_DTO.query.pagination.limite(),
})

export type FinancialTransactionWhereArgs = SchemaValidator.input<typeof schemaQuery>

@Service({ name: 'financial-transaction.use-case.query' })
export class FinancialTransactionQueryUseCase extends UseCase {
    constructor(@Injection.Inject('financial-transaction.repository') private transactionRepository: FinancialTransactionRepository) {
        super()
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

    async queryManyByBankAccountIdWithCategories(args: { bankAccountId: ID }) {
        const bankAccountId = this.validateDTO(args.bankAccountId, schemaNumber)

        const financialTransactionsResult = await this.transactionRepository.findMany({
            where: { bankAccountId },
            include: { categories: { select: { category: true } } },
            orderBy: { expiresIn: 'desc' }
        })

        if (!financialTransactionsResult.isSuccess()) {
            return Result.failure({ ...financialTransactionsResult.getError(), title: 'Query Financial Transactions' })
        }

        return Result.success(financialTransactionsResult.getValue().map(transaction => ({ ...transaction, categories: transaction.categories.map(({ category }) => category) })) || [])
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
