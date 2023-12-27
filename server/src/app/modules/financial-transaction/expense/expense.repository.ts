import { Service } from '@esliph/module'
import { ID } from '@@types'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'
import console from 'console'

@Service({ name: 'financial-expense.repository' })
export class FinancialExpenseRepository extends FinancialTransactionRepository {

    async findByIdAndIdBankAccount(id: ID, bankAccountId: ID) {
        try {
            const financialExpense = await this.database.instance.financialTransaction.findFirst({
                where: { id, bankAccountId, type: FinancialTransactionModel.Type.EXPENSE }
            })

            return this.handleResponse<FinancialTransactionModel.FinancialTransaction>(financialExpense, {
                noAcceptNullable: true,
                error: { title: 'Find Financial Expense', message: 'Financial expense not found' },
            })
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction>(err, {
                error: { title: 'Find Financial Expense', message: 'Financial expense not found' },
            })
        }
    }

    async findManyByIdBankAccount(bankAccountId: ID) {
        try {
            const financialExpense = await this.database.instance.financialTransaction.findMany({
                where: { bankAccountId, type: FinancialTransactionModel.Type.EXPENSE }
            })

            return this.handleResponse<FinancialTransactionModel.FinancialTransaction[]>(financialExpense, {
                error: { title: 'Find Financial Expense', message: 'Financial expense not found' }
            })
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction[]>(err, {
                error: { title: 'Find Financial Expense', message: 'Financial expense not found' },
            })
        }
    }
}
