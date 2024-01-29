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
    zipCode: {
        regex: /^\d{8}$|^\d{5}-\d{3}$/gm,
        messageInvalid: 'Format ZIP Code invalid',
        messageRequired: GLOBAL_DTO.required('ZIP Code')
    },
    city: {
        messageRequired: GLOBAL_DTO.required('City')
    },
    street: {
        messageRequired: GLOBAL_DTO.required('Street')
    },
    country: {
        messageRequired: GLOBAL_DTO.required('Country')
    },
    state: {
        messageRequired: GLOBAL_DTO.required('State')
    },
    neighborhood: {
        messageRequired: GLOBAL_DTO.required('Neighborhood')
    },
}