import { GLOBAL_DTO } from '@global'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'

export const GLOBAL_FINANCIAL_TRANSACTION_DTO = {
    id: GLOBAL_DTO.id.schema({ name: 'Financial Transaction' }),
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
    situation: {
        enum: [FinancialTransactionModel.Situation.CANCELED, FinancialTransactionModel.Situation.LATE, FinancialTransactionModel.Situation.PAID_OUT, FinancialTransactionModel.Situation.PARTIALLY_PAID, FinancialTransactionModel.Situation.PARTIALLY_RECEIVED, FinancialTransactionModel.Situation.PENDING, FinancialTransactionModel.Situation.RECEIVED] as const,
        messageRequired: GLOBAL_DTO.required('Type'),
        messageEnumInvalid: 'Type must be Expense or Income'
    },
    type: {
        enum: [FinancialTransactionModel.Type.EXPENSE, FinancialTransactionModel.Type.INCOME] as const,
        messageRequired: GLOBAL_DTO.required('Type'),
        messageEnumInvalid: 'Type must be Expense or Income'
    },
    typeOccurrence: {
        enum: [FinancialTransactionModel.TypeOccurrence.SINGLE, FinancialTransactionModel.TypeOccurrence.PROGRAMMATIC] as const,
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
        enum: [FinancialTransactionModel.Frequency.ANNUALLY, FinancialTransactionModel.Frequency.DAILY, FinancialTransactionModel.Frequency.MONTHLY, FinancialTransactionModel.Frequency.NULL, FinancialTransactionModel.Frequency.QUARTERLY, FinancialTransactionModel.Frequency.SEMIANNUALLY, FinancialTransactionModel.Frequency.WEEKLY] as const,
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
    paid: {
        situationsEnableToPaid: {
            enum: [FinancialTransactionModel.Situation.PENDING, FinancialTransactionModel.Situation.PARTIALLY_PAID, FinancialTransactionModel.Situation.PARTIALLY_RECEIVED, FinancialTransactionModel.Situation.LATE],
            messageNoSituationEnableToPaid: 'The financial transaction situation does not allow payments to be cleared',
        }
    },
    frequencyInDays: {
        NULL: 0,
        DAILY: 1,
        WEEKLY: 7,
        MONTHLY: 30,
        QUARTERLY: 90,
        SEMIANNUALLY: 180,
        ANNUALLY: 365,
    },
    update: {
        situationsEnableToUpdate: {
            enum: [FinancialTransactionModel.Situation.CANCELED] as const,
            messageInvalidSituationToUpdate: 'It is not allowed to update the financial transaction for this situation',
        }
    }
}