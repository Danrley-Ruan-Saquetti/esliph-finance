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
    bankAccountId: schemaNumber,
})

@Service({ name: 'financial-expense.use-case.query' })
export class FinancialExpenseQueryUseCase extends UseCase {
    constructor(@Injection.Inject('financial-expense.repository') private repository: FinancialExpenseRepository) {
        super()
    }

    async queryByIdAndIdBankAccount(args: { id: ID, bankAccountId: ID }) {
        const { bankAccountId, id } = this.validateDTO(args, schemaIdAndBankAccountId)

        const bankAccountResult = await this.repository.findByIdAndIdBankAccount(id, bankAccountId)

        if (!bankAccountResult.isSuccess()) {
            if (bankAccountResult.isErrorInOperation()) {
                return Result.failure({ title: 'Query Financial Expense', message: 'Unable to query financial expense' })
            }

            return Result.failure({ title: 'Query Financial Expense', message: 'Bank account not found' })
        }

        return Result.success(bankAccountResult.getValue())
    }

    async queryManyByIdBankAccount(args: { bankAccountId: ID }) {
        const bankAccountId = this.validateDTO(args.bankAccountId, schemaNumber)

        const bankAccountResult = await this.repository.findManyByIdBankAccount(bankAccountId)

        if (!bankAccountResult.isSuccess()) {
            if (bankAccountResult.isErrorInOperation()) {
                return Result.failure({ title: 'Query Financial Expense', message: 'Unable to query financial expense' })
            }

            return Result.failure({ title: 'Query Financial Expense', message: 'Bank account not found' })
        }

        return Result.success(bankAccountResult.getValue())
    }
}
