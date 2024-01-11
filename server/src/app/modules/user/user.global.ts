import { GLOBAL_DTO } from '@global'
import { GenerateCodeOptions } from '@services/code-generator.service'
import { UserModel } from './user.model'

export const GLOBAL_USER_DTO = {
    id: GLOBAL_DTO.id.schema({ name: 'User' }),
    people: {
        id: GLOBAL_DTO.id.schema({ name: 'People' }),
    },
    name: {
        minCharacters: 3,
        maxCharacters: 45,
        messageRequired: GLOBAL_DTO.required('Name'),
        messageRangeCharacters: 'The Name must be between 3 and 45 characters',
    },
    type: {
        enum: [UserModel.Type.ADMIN, UserModel.Type.CLIENT] as const,
        messageRequired: GLOBAL_DTO.required('Type'),
        messageEnumInvalid: 'Type must be Admin or Client'
    },
    login: {
        maxCharacters: 254,
        messageRequired: GLOBAL_DTO.required('Login'),
        messageInvalid: 'Login invalid',
        messageRangeCharacters: 'The Login must have a maximum of 254 characters',
    },
    password: {
        messageRequired: GLOBAL_DTO.required('Password'),
        regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/,
        messageRegex: 'The Password must be between 6 and 15 characters, must have 1 uppercase and lowercase letter, 1 number',
    },
    code: {
        template: {
            template: 'XXXXXXXX',
            charactersToReplace: ['X'],
            valuesAllowed: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        } as GenerateCodeOptions,
        attempts: 5,
    },
}
