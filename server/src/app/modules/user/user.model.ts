import * as Database from '@services/database.service'
import { DocumentSimple } from '@@types/index'

export namespace UserModel {
    export const {
        UserType: Type
    } = Database.$Enums
    export type Type = keyof typeof Type

    export type User = Database.User
    export type Model = DocumentSimple<User>
    export type UserWithoutPassword = Omit<User, 'password'>
    export type UserWithoutPasswordWithPeople = Omit<User, 'password'> & {
        people: Database.People
    }
    export type UpdateArgs = Partial<Pick<Model, 'password' | 'login'>>
    export const UserWithoutPasswordSelect: { [x in keyof UserWithoutPassword]: true } = {
        code: true,
        createdAt: true,
        login: true,
        id: true,
        updatedAt: true,
        peopleId: true,
        type: true,
    } as const
}
