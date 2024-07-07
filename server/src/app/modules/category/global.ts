import { DTO } from '@util/dto'

export const GLOBAL_CATEGORY_DTO = {
    id: DTO.id.schema({ name: 'Category' }),
    name: {
        minCharacters: 3,
        maxCharacters: 45,
        messageRequired: DTO.required('Name'),
        messageRangeCharacters: 'The Name must be between 3 and 45 characters',
    },
    bankAccount: {
        id: DTO.id.schema({ name: 'Bank Account' }),
    },
    color: {
        maxCharacters: 45,
        messageRequired: DTO.required('Color'),
        messageInvalid: 'Color invalid',
        messageRangeCharacters: 'The Color must have a maximum of 45 characters',
    },
    isFavorite: {
        default: false,
    },
}
