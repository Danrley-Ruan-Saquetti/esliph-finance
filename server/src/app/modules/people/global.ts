import { DTO } from '@util/dto'
import { PeopleModel } from '@modules/people/model'

export const GLOBAL_PEOPLE_DTO = {
    id: DTO.id.schema({ name: 'People' }),
    gender: {
        enum: [PeopleModel.Gender.MASCULINE, PeopleModel.Gender.FEMININE] as const,
        messageEnumInvalid: 'Gender invalid'
    },
    name: {
        minCharacters: 3,
        maxCharacters: 45,
        messageRequired: DTO.required('Name'),
        messageRangeCharacters: 'The Name must be between 3 and 45 characters',
        messageLastNameRequired: DTO.required('Last name')
    },
    itinCnpj: {
        messageRequired: DTO.required('ITIN/CNPJ'),
    },
    itin: {
        messageRequired: DTO.required('ITIN'),
        messageInvalid: 'ITIN invalid'
    },
    cnpj: {
        messageRequired: DTO.required('CNPJ'),
        messageInvalid: 'CNPJ invalid'
    },
    type: {
        enum: [PeopleModel.Type.LEGAL_ENTITY, PeopleModel.Type.NATURAL_PERSON] as const,
        messageEnumInvalid: 'The person\'s type must be Legal Entity or Natural Person'
    }
}