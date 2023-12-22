import { GLOBAL_DTO } from '@global'

export const GLOBAL_FINANCIAL_TRANSACTION_DTO = {
    bankAccount: {
        id: GLOBAL_DTO.id.schema({ name: 'Bank Account' }),
    },
    title: {
        messageRequired: GLOBAL_DTO.required('Title'),
        messageMinCharacters: 'Title is not empty',
    },
    description: {
        default: '',
    },
    value: {
        messageRequired: GLOBAL_DTO.required('Value'),
        messageMustBePositive: 'The value must be greater than 0 (zero)',
    },
    priority: {
        messageRequired: GLOBAL_DTO.required('Priority'),
        messageMustBePositive: 'The value must be greater than 0 (zero)',
    },
    isObservable: {
        default: false,
    },
    isSendNotification: {
        default: false,
    },
    timesToRepeat: {
        default: 0,
    },
    receiver: {
        default: '',
    },
    sender: {
        default: '',
    },
    expiresIn: {
        default: () => new Date(Date.now()),
    },
}
