import { Document } from '@@types/index'

export type AccountModel = {
    name: string
    login: string
    password: string
}

export type Account = Document<AccountModel>

export type AccountModelWithoutPassword = Omit<Account, 'password'>
