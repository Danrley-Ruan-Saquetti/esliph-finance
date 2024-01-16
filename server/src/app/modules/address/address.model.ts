import * as Database from '@services/database.service'
import { DocumentSimple, ID, } from '@@types'

export namespace AddressModel {
    export const {
        AddressType: Type
    } = Database.$Enums

    export type Type = keyof typeof Type

    export type Address = Database.Address
    export type Model = DocumentSimple<Address>
    export type Simple = Omit<Address, 'peopleId' | 'complement' | 'reference'>
    export type CreateArgs = Omit<Database.Prisma.AddressCreateInput, 'people'> & { peopleId: ID }
    export type UpdateArgs = Partial<Omit<Model, 'peopleId'>>

    export const AddressSimpleSelect: { [x in keyof Simple]: true } = {
        city: true,
        createdAt: true,
        id: true,
        neighborhood: true,
        number: true,
        state: true,
        type: true,
        updatedAt: true,
        street: true,
        zipCode: true,
    } as const
}
