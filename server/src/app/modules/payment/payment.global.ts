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
        default: 0,
        messageMustBePositive: 'Discount must be bigger or equal a R$0,00'
    },
    increase: {
        default: 0,
        messageMustBePositive: 'Increase must be bigger or equal a R$0,00'
    },
    paidAt: {
        default: (date = Date.now()) => new Date(date),
        messagePaidAtHigherCurrentDate: 'Payment date cannot be greater than the current date'
    },
    super: {
        messageNoValue: 'It is not possible to make a payment without the value of the payment or deduction or addition',
    }
}
