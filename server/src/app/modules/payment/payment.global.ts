import { GLOBAL_DTO } from '@global'

export const GLOBAL_PAYMENT_DTO = {
    financialTransaction: {
        id: GLOBAL_DTO.id.schema({ name: 'Financial Transaction' }),
    },
    value: {
        messageRequire: GLOBAL_DTO.required('Value'),
        messageMustBePositive: 'Value must be bigger or equal a R$0,00'
    },
    discount: {
        default: 0
    },
    increase: {
        default: 0
    },
    paidAt: {
        default: (date = Date.now()) => new Date(date)
    }
}
