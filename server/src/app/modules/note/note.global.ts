import { GLOBAL_DTO } from '@global'

export const GLOBAL_NOTE_DTO = {
    financialTransaction: {
        id: GLOBAL_DTO.id.schema({ name: 'Financial Transaction' }),
    },
    description: {
        maxCharacters: 256,
        messageRequired: GLOBAL_DTO.required('Description of the Note'),
        messageRangeCharacters: 'The Note Description must have a maximum of 256 characters',
    },
}
