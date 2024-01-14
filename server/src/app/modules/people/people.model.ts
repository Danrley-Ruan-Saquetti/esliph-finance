import * as Database from '@services/database.service'
import { DocumentSimple } from '@@types'

export namespace PeopleModel {
    export const {
        PeopleGender: Gender,
        PeopleType: Type,
    } = Database.$Enums
    export type Type = keyof typeof Type
    export type Gender = keyof typeof Gender

    export type People = Database.People
    export type Model = DocumentSimple<People>
    export type Simple = Omit<People, 'active'>

    export type CreateArgs = Omit<Database.Prisma.PeopleCreateInput, 'addresses' | 'contacts' | 'users' | 'bankAccounts'>
    export type UpdateArgs = Partial<Pick<Model, 'name' | 'active' | 'dateOfBirth' | 'gender'>>

    export const PeopleSimpleSelect: { [x in keyof Simple]: true } = {
        createdAt: true,
        dateOfBirth: true,
        gender: true,
        id: true,
        itinCnpj: true,
        name: true,
        type: true,
        updatedAt: true
    } as const
}
