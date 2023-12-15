import { GLOBAL_DTO } from '@global'

export const GLOBAL_BANK_ACCOUNT_DTO = {
    name: {
        minCharacters: 3,
        messageRequired: GLOBAL_DTO.required('Name'),
        messageMinCharacters: GLOBAL_DTO.required('Name'),
    },
    passwordMaster: {
        messageRequired: GLOBAL_DTO.required('Password'),
        regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/,
        messageRegex: 'The password must be between 6 and 15 characters, must have 1 uppercase and lowercase letter, 1 number',
    },
    user: {
        id: {
            messageRequired: GLOBAL_DTO.required('ID User'),
            messageInvalid: 'Invalid ID User',
        },
    },
}
