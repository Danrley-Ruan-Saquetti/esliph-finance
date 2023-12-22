import { GLOBAL_DTO } from '@global'

export const GLOBAL_CATEGORY_DTO = {
    name: {
        minCharacters: 3,
        messageRequired: GLOBAL_DTO.required('Name'),
        messageMinCharacters: GLOBAL_DTO.required('Name'),
    },
    bankAccount: {
        id: GLOBAL_DTO.id.schema({ name: 'Bank Account' }),
    },
    color: {
        messageRequired: GLOBAL_DTO.required('Color'),
        messageInvalid: 'Color invalid',
    },
    isFavorite: {
        default: false,
    },
}
