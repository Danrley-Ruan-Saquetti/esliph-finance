import * as Database from '@services/database.service'
import { DocumentSimple } from '@@types'

export namespace PeopleModel {
    export const {
        PeopleGender: Gender,
        PeopleType: Type,
    } = Database.$Enums
    export type Type = keyof typeof Type
    export type Gender = keyof typeof Gender

    export type User = Database.User
    export type People = Database.People
    export type Model = DocumentSimple<People>
    export type UpdateArgs = Partial<Pick<Model, 'name' | 'active' | 'dateOfBirth' | 'gender'>>
}
