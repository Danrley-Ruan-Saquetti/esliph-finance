import * as Database from '@services/database.service'
import { DocumentSimple } from '@@types/index'

export namespace BankAccountModel {
    export type BankAccount = Database.BankAccount
    export type Model = DocumentSimple<BankAccount>
    export type BankAccountWithoutPasswordMaster = Omit<BankAccount, 'passwordMaster'>
    export const BankAccountWithoutPasswordMasterSelect: { [x in keyof BankAccountWithoutPasswordMaster]: true } = {
        id: true,
        userId: true,
        code: true,
        name: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
    } as const
}
