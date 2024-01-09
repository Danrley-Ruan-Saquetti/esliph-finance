import { Service } from '@esliph/module'
import { ID } from '@@types'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'
import console from 'console'

@Service({ name: 'financial-expense.repository' })
export class FinancialExpenseRepository extends FinancialTransactionRepository {
    private static GLOBAL_EXPENSE_MESSAGE = {
        find: {
            title: 'Find Expense Financial Transaction',
            notFound: 'Expense financial transaction not found',
            failed: 'Unable to query expense financial transaction'
        },
        findMany: {
            title: 'Find Expense Financial Transactions',
            failed: 'Unable to query expense financial transactions'
        }
    }

    async findByIdAndBankAccountId(id: ID, bankAccountId: ID) {
        try {
            const financialExpense = await this.database.instance.financialTransaction.findFirst({ where: { id, bankAccountId, type: FinancialTransactionModel.Type.EXPENSE } })

            return this.handleResponse<FinancialTransactionModel.FinancialTransaction>(financialExpense, {
                noAcceptNullable: true,
                error: { title: FinancialExpenseRepository.GLOBAL_EXPENSE_MESSAGE.find.title, message: FinancialExpenseRepository.GLOBAL_EXPENSE_MESSAGE.find.notFound }
            })
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction>(err, {
                error: { title: FinancialExpenseRepository.GLOBAL_EXPENSE_MESSAGE.find.title, message: FinancialExpenseRepository.GLOBAL_EXPENSE_MESSAGE.find.failed },
            })
        }
    }

    async findManyByBankAccountId(bankAccountId: ID) {
        try {
            const financialExpense = await this.database.instance.financialTransaction.findMany({ where: { bankAccountId, type: FinancialTransactionModel.Type.EXPENSE } })

            return this.handleResponse<FinancialTransactionModel.FinancialTransaction[]>(financialExpense)
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction[]>(err, {
                error: { title: FinancialExpenseRepository.GLOBAL_EXPENSE_MESSAGE.findMany.title, message: FinancialExpenseRepository.GLOBAL_EXPENSE_MESSAGE.findMany.failed }
            })
        }
    }
}
