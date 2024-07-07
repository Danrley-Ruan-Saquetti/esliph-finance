import { DTO } from '@util/dto'
import { UserModel } from '@modules/user/model'
import { GenerateCodeOptions } from '@services/code-generator'

export const GLOBAL_USER_DTO = {
    id: DTO.id.schema({ name: 'User' }),
    people: {
        id: DTO.id.schema({ name: 'People' }),
    },
    type: {
        enum: [UserModel.Type.ADMIN, UserModel.Type.CUSTOMER] as const,
        messageRequired: DTO.required('Type'),
        messageEnumInvalid: 'Type must be Admin or Customer'
    },
    email: {
        maxCharacters: 254,
        messageRequired: DTO.required('E-mail'),
        messageInvalid: 'E-mail invalid',
        messageRangeCharacters: 'The E-mail must have a maximum of 254 characters',
    },
    login: {
        maxCharacters: 254,
        messageRequired: DTO.required('Login'),
        messageInvalid: 'Login invalid',
        messageRangeCharacters: 'The Login must have a maximum of 254 characters',
    },
    password: {
        messageRequired: DTO.required('Password'),
        regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/,
        messageRegex: 'The Password must be between 6 and 15 characters, must have 1 uppercase and lowercase letter, 1 number',
    },
    code: {
        template: {
            template: 'XXXXXXXX',
            charactersToReplace: ['X'],
            valuesAllowed: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        } as GenerateCodeOptions,
    },
}
