import { DocumentSimple } from '@@types'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'

export namespace FinancialIncomeModel {
    export type FinancialIncome = Omit<FinancialTransactionModel.FinancialTransaction, 'receiver' | 'type'> & { type: 'INCOME' }
    export type Model = DocumentSimple<FinancialIncome>
}