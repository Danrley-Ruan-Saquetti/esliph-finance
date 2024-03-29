import { Injection, Service, Result } from '@core'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { SchemaValidator } from '@services/validator.service'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'
import { FinancialTransactionFilterArgs } from '@modules/financial-transaction/use-case/query.use-case'

const schemaNumber = SchemaValidator.coerce.number()
const schemaIdAndBankAccountId = SchemaValidator.object({
    id: schemaNumber,
})

export type FinancialIncomeFilterArgs = Omit<FinancialTransactionFilterArgs, 'type'>

@Service({ name: 'financial-income.use-case.query' })
export class FinancialIncomeQueryUseCase extends UseCase {
    constructor(@Injection.Inject('financial-transaction.repository') private transactionRepository: FinancialTransactionRepository) {
        super()
    }

    async queryManyByBankAccountId(args: FinancialIncomeFilterArgs) {
        const bankAccountId = this.validateDTO(args.bankAccountId, schemaNumber)

        const bankAccountResult = await this.transactionRepository.findMany({
            where: { bankAccountId, type: FinancialTransactionModel.Type.INCOME }
        })

        if (!bankAccountResult.isSuccess()) {
            return Result.failure({ ...bankAccountResult.getError(), title: 'Query Financial Income' })
        }

        return Result.success(bankAccountResult.getValue())
    }

    async queryByIdAndBankAccountIdWithPaymentsAndNotes(args: { id: ID }) {
        const { id } = this.validateDTO(args, schemaIdAndBankAccountId)

        const bankAccountResult = await this.transactionRepository.findUnique({
            where: { id, type: FinancialTransactionModel.Type.INCOME },
            include: {
                payments: true,
                notes: true,
            }
        })

        if (!bankAccountResult.isSuccess()) {
            return Result.failure({ ...bankAccountResult.getError(), title: 'Query Financial Income' })
        }

        return Result.success(bankAccountResult.getValue())
    }
}
