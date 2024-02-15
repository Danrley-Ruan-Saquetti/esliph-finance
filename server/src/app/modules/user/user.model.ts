import * as Database from '@services/database.service'
import { DocumentSimple } from '@@types/index'
import { PeopleModel } from '@modules/people/people.model'

export namespace UserModel {
    export const {
        UserType: Type
    } = Database.$Enums
    export type Type = keyof typeof Type

    export type User = Database.User
    export type Model = DocumentSimple<User>
    export type Simple = Omit<User, 'active' | 'password' | 'type'>
    export type a = {
        id: number;
        peopleId: number;
        type: Database.$Enums.UserType;
        active: boolean;
        code: string;
        login: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }

    export type UserWithPeople = User & { people: PeopleModel.People }
    export type UserWithoutPassword = Omit<User, 'password'>
    export type UserWithoutPasswordWithPeople = Omit<User, 'password'> & { people: PeopleModel.People }

    export type UpdateArgs = Partial<Pick<Model, 'password' | 'login' | 'active'>>
    export const UserWithoutPasswordSelect: { [x in keyof UserWithoutPassword]: true } = {
        id: true,
        peopleId: true,
        code: true,
        login: true,
        type: true,
        active: true,
        updatedAt: true,
        createdAt: true,
    } as const
    export const UserWithoutPasswordSelectWithPeople: { [x in keyof UserWithoutPasswordWithPeople]: true } = {
        id: true,
        peopleId: true,
        code: true,
        login: true,
        type: true,
        active: true,
        updatedAt: true,
        createdAt: true,
        people: true,
    } as const
}
