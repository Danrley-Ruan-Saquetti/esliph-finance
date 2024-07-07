import { DTO } from '@util/dto'

export const GLOBAL_PAYMENT_DTO = {
    id: DTO.id.schema({ name: 'Payment' }),
    financialTransaction: {
        id: DTO.id.schema({ name: 'Financial Transaction' }),
    },
    observation: {
        default: ''
    },
    valuePaid: {
        messageRequire: DTO.required('Value Paid'),
        messageMustBePositive: 'Value Paid must be bigger or equal a R$0,00'
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
