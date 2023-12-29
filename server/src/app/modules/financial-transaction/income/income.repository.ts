import { Service } from '@esliph/module'
import { ID } from '@@types'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'

@Service({ name: 'financial-income.repository' })
export class FinancialIncomeRepository extends FinancialTransactionRepository {

    async findByIdAndBankAccountId(id: ID, bankAccountId: ID) {
        try {
            const financialIncome = await this.database.instance.financialTransaction.findFirst({
                where: { id, bankAccountId, type: FinancialTransactionModel.Type.INCOME }
            })

            return this.handleResponse<FinancialTransactionModel.FinancialTransaction>(financialIncome, {
                noAcceptNullable: true,
                error: { title: 'Find Financial Income', message: 'Financial income not found' },
            })
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction>(err, {
                error: { title: 'Find Financial Income', message: 'Financial income not found' },
            })
        }
    }

    async findManyIdBankAccount(id: ID, bankAccountId: ID) {
        try {
            const financialIncome = await this.database.instance.financialTransaction.findMany({
                where: { id, bankAccountId, type: FinancialTransactionModel.Type.INCOME }
            })

            return this.handleResponse<FinancialTransactionModel.FinancialTransaction[]>(financialIncome, {
                error: { title: 'Find Financial Income', message: 'Financial income not found' }
            })
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction[]>(err, {
                error: { title: 'Find Financial Income', message: 'Financial income not found' },
            })
        }
    }
}
