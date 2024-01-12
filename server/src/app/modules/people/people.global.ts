import { GLOBAL_DTO } from '@global'
import { PeopleModel } from '@modules/people/people.model'
import { GenerateCodeOptions } from '@services/code-generator.service'

export const GLOBAL_PEOPLE_DTO = {
    id: GLOBAL_DTO.id.schema({ name: 'People' }),
    gender: {
        enum: [PeopleModel.Gender.MASCULINE, PeopleModel.Gender.FEMININE] as const,
        messageEnumInvalid: 'Gender invalid'
    },
    name: {
        minCharacters: 3,
        maxCharacters: 45,
        messageRequired: GLOBAL_DTO.required('Name'),
        messageRangeCharacters: 'The Name must be between 3 and 45 characters',
    },
    itin: {
        messageRequired: GLOBAL_DTO.required('ITIN'),
        messageInvalid: 'ITIN invalid'
    },
    cnpj: {
        messageRequired: GLOBAL_DTO.required('CNPJ'),
        messageInvalid: 'CNPJ invalid'
    },
    type: {
        enum: [PeopleModel.Type.LEGAL_ENTITY, PeopleModel.Type.NATURAL_PERSON] as const,
        messageEnumInvalid: 'The person\'s type must be Legal Entity or Natural Person'
    }
}

export const GLOBAL_PEOPLE_RULES = {
    itin: {
        template: {
            template: 'XXX.XXX.XXX-XX',
            charactersToReplace: ['X'],
            valuesAllowed: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        } as GenerateCodeOptions,
    },
    cnpj: {
        template: {
            template: 'XX.XXX.XXX/XXXX-XX',
            charactersToReplace: ['X'],
            valuesAllowed: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        } as GenerateCodeOptions,
    },
}