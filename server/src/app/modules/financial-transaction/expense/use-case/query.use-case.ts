import { Injection, Service, Result } from '@core'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { SchemaValidator } from '@services/validator.service'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'

const schemaNumber = SchemaValidator.coerce.number()
const schemaIdAndBankAccountId = SchemaValidator.object({
    id: schemaNumber,
})

@Service({ name: 'financial-expense.use-case.query' })
export class FinancialExpenseQueryUseCase extends UseCase {
    constructor(@Injection.Inject('financial-transaction.repository') private transactionRepository: FinancialTransactionRepository) {
        super()
    }

    async queryByIdAndBankAccountIdWithPaymentsAndNotes(args: { id: ID }) {
        const { id } = this.validateDTO(args, schemaIdAndBankAccountId)

        const bankAccountResult = await this.transactionRepository.findUnique({
            where: { id, type: FinancialTransactionModel.Type.EXPENSE },
            include: {
                payments: true,
                notes: true
            }
        })

        if (!bankAccountResult.isSuccess()) {
            return Result.failure({ ...bankAccountResult.getError(), title: 'Query Financial Expense' })
        }

        return Result.success(bankAccountResult.getValue())
    }

    async queryManyByBankAccountId(args: { bankAccountId: ID }) {
        const bankAccountId = this.validateDTO(args.bankAccountId, schemaNumber)

        const bankAccountResult = await this.transactionRepository.findMany({
            where: { bankAccountId, type: FinancialTransactionModel.Type.EXPENSE }
        })

        if (!bankAccountResult.isSuccess()) {
            return Result.failure({ ...bankAccountResult.getError(), title: 'Query Financial Expenses' })
        }

        return Result.success(bankAccountResult.getValue())
    }
}
