import {} from '@services/database.service'
import { Document } from '@@types/index'

export namespace AccountModel {
    export type Model = {
        name: string
        email: string
        password: string
        balance: number
    }

    export type WithoutPassword = Omit<Model, 'password'>

    export enum Attributes {
        ID = 'id',
        NAME = 'name',
        EMAIL = 'email',
        PASSWORD = 'password',
        BALANCE = 'balance',
        CREATED_AT = 'createdAt',
        UPDATE_AT = 'updatedAt',
    }

    export const AccountAttributes = [
        Attributes.ID,
        Attributes.NAME,
        Attributes.EMAIL,
        Attributes.PASSWORD,
        Attributes.BALANCE,
        Attributes.CREATED_AT,
        Attributes.UPDATE_AT,
    ] as const

    export const AccountWithoutPasswordAttributes = [
        Attributes.ID,
        Attributes.NAME,
        Attributes.EMAIL,
        Attributes.BALANCE,
        Attributes.CREATED_AT,
        Attributes.UPDATE_AT,
    ] as const
}

export namespace AccountEntity {
    export const ModelName = 'account'
    export type Entity = Document<AccountModel.Model>

    export type WithoutPassword = Omit<Entity, 'password'>

    export enum Attributes {
        ID = 'id',
        NAME = 'name',
        EMAIL = 'email',
        PASSWORD = 'password',
        BALANCE = 'balance',
        CREATED_AT = 'created_at',
        UPDATE_AT = 'updated_at',
    }

    export const AccountAttributes = [
        Attributes.ID,
        Attributes.NAME,
        Attributes.EMAIL,
        Attributes.PASSWORD,
        Attributes.BALANCE,
        Attributes.CREATED_AT,
        Attributes.UPDATE_AT,
    ] as const

    export const AccountWithoutPasswordAttributes = [
        Attributes.ID,
        Attributes.NAME,
        Attributes.EMAIL,
        Attributes.BALANCE,
        Attributes.CREATED_AT,
        Attributes.UPDATE_AT,
    ] as const
}
