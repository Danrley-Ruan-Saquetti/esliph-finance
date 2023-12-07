import * as Database from '@services/database.service'
import { DocumentSimple } from '@@types/index'

export namespace BankAccountModel {
    export type BankAccount = Database.BankAccount
    export type Model = DocumentSimple<BankAccount>
    export type BankAccountWithoutPasswordMaster = Omit<BankAccount, 'passwordMaster'>
    export const BankAccountWithoutPasswordMasterSelect = { id: true, userId: true, name: true, balance: true, createdAt: true, updatedAt: true } as const
}
