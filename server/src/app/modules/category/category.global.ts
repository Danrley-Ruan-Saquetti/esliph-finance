import { GLOBAL_DTO } from '@global'

export const GLOBAL_CATEGORY_DTO = {
    id: GLOBAL_DTO.id.schema({ name: 'Category' }),
    name: {
        minCharacters: 3,
        maxCharacters: 45,
        messageRequired: GLOBAL_DTO.required('Name'),
        messageRangeCharacters: 'The Name must be between 3 and 45 characters',
    },
    bankAccount: {
        id: GLOBAL_DTO.id.schema({ name: 'Bank Account' }),
    },
    color: {
        maxCharacters: 45,
        messageRequired: GLOBAL_DTO.required('Color'),
        messageInvalid: 'Color invalid',
        messageRangeCharacters: 'The Color must have a maximum of 45 characters',
    },
    isFavorite: {
        default: false,
    },
}
