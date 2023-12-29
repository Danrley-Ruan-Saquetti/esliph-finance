import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { Result } from '@esliph/common'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { ValidatorService } from '@services/validator.service'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'

const schemaNumber = ValidatorService.schema.coerce.number()
const schemaIdAndBankAccountId = ValidatorService.schema.object({
    id: schemaNumber,
    bankAccountId: schemaNumber,
})

@Service({ name: 'financial-transaction.use-case.query' })
export class FinancialTransactionQueryUseCase extends UseCase {
    constructor(@Injection.Inject('financial-transaction.repository') private repository: FinancialTransactionRepository) {
        super()
    }

    async queryByIdAndBankAccountId(args: { id: ID, bankAccountId: ID }) {
        const { bankAccountId, id } = this.validateDTO(args, schemaIdAndBankAccountId)

        const bankAccountResult = await this.repository.findByIdAndBankAccountId(id, bankAccountId)

        if (!bankAccountResult.isSuccess()) {
            if (bankAccountResult.isErrorInOperation()) {
                return Result.failure({ title: 'Query Financial Income', message: 'Unable to query financial transaction' })
            }

            return Result.failure({ title: 'Query Financial Income', message: 'Bank account not found' })
        }

        return Result.success(bankAccountResult.getValue())
    }

    async queryManyByBankAccountId(args: { bankAccountId: ID }) {
        const bankAccountId = this.validateDTO(args.bankAccountId, schemaNumber)

        const financialTransactionsResult = await this.repository.findManyByBankAccountId(bankAccountId)

        if (!financialTransactionsResult.isSuccess()) {
            if (financialTransactionsResult.isErrorInOperation()) {
                return Result.failure({ title: 'Query Financial Income', message: 'Unable to query financial transaction' })
            }

            return Result.failure({ title: 'Query Financial Income', message: 'Bank account not found' })
        }

        return Result.success(financialTransactionsResult.getValue())
    }
}
