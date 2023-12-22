import { GLOBAL_DTO } from '@global'
import { GenerateCodeOptions } from '@services/code-generator.service'

export const GLOBAL_BANK_ACCOUNT_DTO = {
    name: {
        minCharacters: 3,
        messageRequired: GLOBAL_DTO.required('Name'),
        messageMinCharacters: GLOBAL_DTO.required('Name'),
    },
    password: {
        messageRequired: GLOBAL_DTO.required('Password'),
        regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/,
        messageRegex: 'The password must be between 6 and 15 characters, must have 1 uppercase and lowercase letter, 1 number',
    },
    user: {
        id: GLOBAL_DTO.id.schema({ name: 'User' }),
    },
    code: {
        messageRequired: GLOBAL_DTO.required('Password'),
        template: {
            template: 'XXX-XXXXX-XX',
            charactersToReplace: ['X'],
            charactersToIgnore: [],
            valuesAllowed: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        } as GenerateCodeOptions,
        attempts: 5,
    },
}
