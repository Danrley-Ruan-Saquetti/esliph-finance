import { GLOBAL_DTO } from '@global'
import { GenerateCodeOptions } from '@services/code-generator.service'
import { MaskDataOptions } from '@services/mask-data.service'

export const GLOBAL_BANK_ACCOUNT_DTO = {
    id: GLOBAL_DTO.id.schema({ name: 'Bank Account' }),
    name: {
        minCharacters: 3,
        messageRequired: GLOBAL_DTO.required('Name'),
        maxCharacters: 45,
        messageRangeCharacters: 'The Name must be between 3 and 45 characters',
    },
    password: {
        messageRequired: GLOBAL_DTO.required('Password'),
        regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/,
        messageRegex: 'The password must be between 6 and 15 characters, must have 1 uppercase and lowercase letter, 1 number',
    },
    user: {
        id: GLOBAL_DTO.id.schema({ name: 'User' }),
    },
    people: {
        id: GLOBAL_DTO.id.schema({ name: 'People' }),
    },
    code: {
        messageRequired: GLOBAL_DTO.required('Code'),
        template: {
            template: 'XXX-XXXXXXXX-XX',
            charactersToReplace: ['X'],
            valuesAllowed: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        } as GenerateCodeOptions,
        attempts: 5,
        maskData: {
            template: 'XX*-********-*X',
            charactersToReplace: ['*'],
            valueReplace: '*',
        } as MaskDataOptions,
    },
    balance: {
        maskData: {
            template: '******,**',
            charactersToReplace: [],
            valueReplace: '',
        } as MaskDataOptions,
    },
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
