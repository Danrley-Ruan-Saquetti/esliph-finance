import { DTO } from '@util/dto'
import { FormatCodeOptions, GenerateCodeOptions } from '@services/code-generator'

export const GLOBAL_BANK_ACCOUNT_DTO = {
    id: DTO.id.schema({ name: 'Bank Account' }),
    name: {
        minCharacters: 3,
        messageRequired: DTO.required('Name'),
        maxCharacters: 45,
        messageRangeCharacters: 'The Name must be between 3 and 45 characters',
    },
    password: {
        messageRequired: DTO.required('Password'),
        regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/,
        messageRegex: 'The password must be between 6 and 15 characters, must have 1 uppercase and lowercase letter, 1 number',
    },
    people: {
        id: DTO.id.schema({ name: 'People' }),
    },
    user: {
        id: DTO.id.schema({ name: 'User' }),
    },
    code: {
        messageRequired: DTO.required('Code'),
        template: {
            template: 'XXX-XXXXXXXX-XX',
            charactersToReplace: ['X'],
            valuesAllowed: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        } as GenerateCodeOptions,
        attempts: 5,
        maskData: {
            template: 'XX*-********-*X',
            charactersToReplace: ['*'],
            values: ['*'],
        } as FormatCodeOptions,
    },
    slug: {
        messageRequired: DTO.required('Slug'),
        regex: /^[a-z0-9]+([_-][a-z0-9]+)*$/,
        messageRegex: 'The slug must be: lowercase; without accents and special characters; no spaces; no multiple hyphens',
    }
}

export const GLOBAL_BANK_ACCOUNT_RULES = {
    queryBalance: {
        dateStart: {
            messageRequired: 'The start date of financial transactions is required',
        },
        dateEnd: {
            messageRequired: 'The end date of financial transactions is required',
        },
    },
    updateBalance: {
        value: {
            valueRequest: '',
            messageMustBePositive: 'Discount must be bigger or equal a R$0,00'
        },
    }
}
