import { GLOBAL_DTO } from '@global'
import { FinancialTransactionModel } from './financial-transaction.model'

export const GLOBAL_FINANCIAL_TRANSACTION_DTO = {
    bankAccount: {
        id: GLOBAL_DTO.id.schema({ name: 'Bank Account' }),
    },
    title: {
        minCharacters: 3,
        maxCharacters: 45,
        messageRequired: GLOBAL_DTO.required('Title'),
        messageRangeCharacters: 'The Title must be between 3 and 55 characters',

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
        messageMustBePositive: 'The Priority must be greater or equal than 0 (zero)',
    },
    isObservable: {
        default: false,
    },
    type: {
        enum: [FinancialTransactionModel.Type.EXPENSE, FinancialTransactionModel.Type.INCOME],
        messageRequired: GLOBAL_DTO.required('Type'),
        messageEnumInvalid: 'Type must be Expense or Income'
    },
    typeOccurrence: {
        enum: [FinancialTransactionModel.TypeOccurrence.SINGLE, FinancialTransactionModel.TypeOccurrence.PROGRAMMATIC],
        messageRequired: GLOBAL_DTO.required('Type Occurrence'),
        messageEnumInvalid: 'Type Occurrence must be Single or Programmatic'
    },
    isSendNotification: {
        default: false,
    },
    timesToRepeat: {
        default: 0,
        messageRequired: GLOBAL_DTO.required('Times to Repeat'),
        messageMustBePositive: 'The number of Times to Repeat must be greater than 0 (zero)',
    },
    frequency: {
        messageEnumInvalid: 'The frequency of the occurrence must be one of the types: Daily, Weekly, Monthly, Quarterly, Semiannually or Annually',
        default: FinancialTransactionModel.Frequency.NULL,
    },
    receiver: {
        default: '',
        messageRequired: GLOBAL_DTO.required('Receiver'),
    },
    sender: {
        default: '',
        messageRequired: GLOBAL_DTO.required('Sender'),
    },
    expiresIn: {
        default: () => new Date(Date.now()),
    },
    dateTimeCompetence: {
        default: () => new Date(Date.now()),
    },
}

export const GLOBAL_FINANCIAL_TRANSACTION_RULES = {
    situationsEnableToPaid: [FinancialTransactionModel.Situation.PENDING, FinancialTransactionModel.Situation.PARTIALLY_PAID, FinancialTransactionModel.Situation.PARTIALLY_RECEIVED, FinancialTransactionModel.Situation.LATE],
    messageNoSituationEnableToPaid: 'The financial transaction situation does not allow payments to be cleared'
}