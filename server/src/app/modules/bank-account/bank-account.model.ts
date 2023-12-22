import * as Database from '@services/database.service'
import { DocumentSimple } from '@@types/index'

export namespace BankAccountModel {
    export type BankAccount = Database.BankAccount
    export type Model = DocumentSimple<BankAccount>
    export type BankAccountWithoutPassword = Omit<BankAccount, 'password'>
    export const BankAccountWithoutPasswordSelect: { [x in keyof BankAccountWithoutPassword]: true } = {
        id: true,
        userId: true,
        code: true,
        name: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
    } as const
}
