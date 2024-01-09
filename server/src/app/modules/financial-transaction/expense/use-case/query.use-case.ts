import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { Result } from '@esliph/common'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { ValidatorService } from '@services/validator.service'
import { FinancialExpenseRepository } from '@modules/financial-transaction/expense/expense.repository'

const schemaNumber = ValidatorService.schema.coerce.number()
const schemaIdAndBankAccountId = ValidatorService.schema.object({
    id: schemaNumber,
})

@Service({ name: 'financial-expense.use-case.query' })
export class FinancialExpenseQueryUseCase extends UseCase {
    constructor(@Injection.Inject('financial-expense.repository') private transactionRepository: FinancialExpenseRepository) {
        super()
    }

    async queryByIdAndBankAccountIdWithPaymentsAndNotes(args: { id: ID }) {
        const { id } = this.validateDTO(args, schemaIdAndBankAccountId)

        const bankAccountResult = await this.transactionRepository.findByIdWithPaymentsAndNotesAndCategories(id)

        if (!bankAccountResult.isSuccess()) {
            return Result.failure({ ...bankAccountResult.getError(), title: 'Query Financial Expense' })
        }

        return Result.success(bankAccountResult.getValue())
    }

    async queryManyByBankAccountId(args: { bankAccountId: ID }) {
        const bankAccountId = this.validateDTO(args.bankAccountId, schemaNumber)

        const bankAccountResult = await this.transactionRepository.findManyByBankAccountId(bankAccountId)

        if (!bankAccountResult.isSuccess()) {
            return Result.failure({ ...bankAccountResult.getError(), title: 'Query Financial Expenses' })
        }

        return Result.success(bankAccountResult.getValue())
    }
}
