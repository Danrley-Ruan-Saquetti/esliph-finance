import { DocumentSimple } from '@@types'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'

export namespace FinancialExpenseModel {
    export type FinancialExpense = Omit<FinancialTransactionModel.FinancialTransaction, 'sender' | 'type'> & { type: 'EXPENSE' }
    export type Model = DocumentSimple<FinancialExpense>
}