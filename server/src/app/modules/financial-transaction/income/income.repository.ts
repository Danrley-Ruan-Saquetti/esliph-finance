import { Service } from '@esliph/module'
import { ID } from '@@types'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'

@Service({ name: 'financial-income.repository' })
export class FinancialIncomeRepository extends FinancialTransactionRepository {
    private static GLOBAL_INCOME_MESSAGE = {
        find: {
            title: 'Find Income Financial Transaction',
            notFound: 'Income financial transaction not found',
            failed: 'Unable to query income financial transaction'
        },
        findMany: {
            title: 'Find Income Financial Transactions',
            failed: 'Unable to query income financial transactions'
        }
    }

    async findByIdAndBankAccountId(id: ID, bankAccountId: ID) {
        try {
            const financialIncome = await this.database.instance.financialTransaction.findFirst({ where: { id, bankAccountId, type: FinancialTransactionModel.Type.INCOME } })

            return this.handleResponse<FinancialTransactionModel.FinancialTransaction>(financialIncome, {
                noAcceptNullable: true,
                error: { title: FinancialIncomeRepository.GLOBAL_INCOME_MESSAGE.find.title, message: FinancialIncomeRepository.GLOBAL_INCOME_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction>(err, {
                error: { title: FinancialIncomeRepository.GLOBAL_INCOME_MESSAGE.find.title, message: FinancialIncomeRepository.GLOBAL_INCOME_MESSAGE.find.failed },
            })
        }
    }

    async findManyIdBankAccount(id: ID, bankAccountId: ID) {
        try {
            const financialIncome = await this.database.instance.financialTransaction.findMany({ where: { id, bankAccountId, type: FinancialTransactionModel.Type.INCOME } })

            return this.handleResponse<FinancialTransactionModel.FinancialTransaction[]>(financialIncome)
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction[]>(err, {
                error: { title: FinancialIncomeRepository.GLOBAL_INCOME_MESSAGE.findMany.title, message: FinancialIncomeRepository.GLOBAL_INCOME_MESSAGE.findMany.failed },
            })
        }
    }
}
