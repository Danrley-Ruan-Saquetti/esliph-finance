import { GLOBAL_DTO } from '@global'
import { AddressModel } from '@modules/address/address.model'

export const GLOBAL_ADDRESS_DTO = {
    id: GLOBAL_DTO.id.schema({ name: 'Address' }),
    people: {
        id: GLOBAL_DTO.id.schema({ name: 'People' })
    },
    type: {
        enum: [AddressModel.Type.COMMERCIAL, AddressModel.Type.RESIDENTIAL] as const,
        messageRequired: GLOBAL_DTO.required('Type'),
        messageEnumInvalid: 'Type must be Commercial or Residential',
        default: AddressModel.Type.RESIDENTIAL
    },
}
