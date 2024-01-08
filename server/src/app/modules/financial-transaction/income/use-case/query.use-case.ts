import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { Result } from '@esliph/common'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { ValidatorService } from '@services/validator.service'
import { FinancialIncomeRepository } from '@modules/financial-transaction/income/income.repository'

const schemaNumber = ValidatorService.schema.coerce.number()
const schemaIdAndBankAccountId = ValidatorService.schema.object({
    id: schemaNumber,
})

@Service({ name: 'financial-income.use-case.query' })
export class FinancialIncomeQueryUseCase extends UseCase {
    constructor(@Injection.Inject('financial-income.repository') private transactionRepository: FinancialIncomeRepository) {
        super()
    }

    async queryByIdAndBankAccountIdWithPaymentsAndNotes(args: { id: ID }) {
        const { id } = this.validateDTO(args, schemaIdAndBankAccountId)

        const bankAccountResult = await this.transactionRepository.findByIdWithPaymentsAndNotesAndCategories(id)

        if (!bankAccountResult.isSuccess()) {
            if (bankAccountResult.isErrorInOperation()) {
                return Result.failure({ title: 'Query Financial Income', message: 'Unable to query financial income' })
            }

            return Result.failure({ title: 'Query Financial Income', message: 'Bank account not found' })
        }

        return Result.success(bankAccountResult.getValue())
    }

    async queryManyByBankAccountId(args: { bankAccountId: ID }) {
        const bankAccountId = this.validateDTO(args.bankAccountId, schemaNumber)

        const bankAccountResult = await this.transactionRepository.findManyByBankAccountId(bankAccountId)

        if (!bankAccountResult.isSuccess()) {
            if (bankAccountResult.isErrorInOperation()) {
                return Result.failure({ title: 'Query Financial Income', message: 'Unable to query financial income' })
            }

            return Result.failure({ title: 'Query Financial Income', message: 'Bank account not found' })
        }

        return Result.success(bankAccountResult.getValue())
    }
}
