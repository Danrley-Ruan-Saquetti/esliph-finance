import * as Database from '@services/database.service'
import { DocumentSimple } from '@@types'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'

export namespace BankAccountModel {
    export type BankAccount = Database.BankAccount
    export type Model = DocumentSimple<BankAccount>
    export type BankAccountWithoutPassword = Omit<BankAccount, 'password'>
    export type BankAccountWithFinancialTransactionsAndPayments = Model & {
        financialTransactions: FinancialTransactionModel.FinancialTransactionWithPayments[]
    }
    export type BankAccountWithoutPasswordAndBalance = Omit<BankAccount, 'password' | 'balance'>
    export const BankAccountWithoutPasswordSelect: { [x in keyof BankAccountWithoutPassword]: true } = {
        id: true,
        userId: true,
        code: true,
        name: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
    } as const
    export const BankAccountWithoutPasswordSelectAndBalance: { [x in keyof BankAccountWithoutPasswordAndBalance]: true } = {
        id: true,
        userId: true,
        code: true,
        name: true,
        createdAt: true,
        updatedAt: true,
    } as const
}
