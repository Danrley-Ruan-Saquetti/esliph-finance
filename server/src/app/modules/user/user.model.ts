import * as Database from '@services/database.service'
import { DocumentSimple } from '@@types/index'

export namespace UserModel {
    export type User = Database.User
    export type Model = DocumentSimple<User>
    export type UserWithoutPassword = Omit<User, 'password'>
    export const UserWithoutPasswordSelect: { [x in keyof UserWithoutPassword]: true } = {
        code: true,
        createdAt: true,
        email: true,
        id: true,
        name: true,
        updatedAt: true,
    } as const
}
