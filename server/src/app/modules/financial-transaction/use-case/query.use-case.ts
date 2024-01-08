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

        const financialTransactionsResult = await this.transactionRepository.findByIdWithNotes(id)

        if (!financialTransactionsResult.isSuccess()) {
            if (financialTransactionsResult.isErrorInOperation()) {
                return Result.failure({ title: 'Query Financial Transaction', message: 'Unable to query financial transaction' })
            }

            return Result.failure({ title: 'Query Financial Transaction', message: 'Financial transaction not found' })
        }

        return Result.success(financialTransactionsResult.getValue())
    }

    async queryByIdWithNotesAndPayments(args: { id: ID }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const financialTransactionsResult = await this.transactionRepository.findByIdWithPaymentsAndNotesAndCategories(id)

        if (!financialTransactionsResult.isSuccess()) {
            if (financialTransactionsResult.isErrorInOperation()) {
                return Result.failure({ title: 'Query Financial Transaction', message: 'Unable to query financial transaction' })
            }

            return Result.failure({ title: 'Query Financial Transaction', message: 'Financial transaction not found' })
        }

        return Result.success(financialTransactionsResult.getValue())
    }

    async queryManyByBankAccountId(args: { bankAccountId: ID }) {
        const bankAccountId = this.validateDTO(args.bankAccountId, schemaNumber)

        const financialTransactionsResult = await this.transactionRepository.findManyByBankAccountId(bankAccountId)

        if (!financialTransactionsResult.isSuccess()) {
            if (financialTransactionsResult.isErrorInOperation()) {
                return Result.failure({ title: 'Query Financial Transactions', message: 'Unable to query financial transactions' })
            }
        }

        return Result.success(financialTransactionsResult.getValue() || [])
    }
}
