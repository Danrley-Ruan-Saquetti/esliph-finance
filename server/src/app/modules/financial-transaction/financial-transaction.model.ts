import * as Database from '@services/database.service'
import { DocumentSimple } from '@@types'
import { PaymentModel } from '@modules/payment/payment.model'
import { NoteModel } from '@modules/note/note.model'
import { CategoryModel } from '@modules/category/category.model'

export namespace FinancialTransactionModel {
    export const {
        FinancialTransactionTypeOccurrence: TypeOccurrence,
        FinancialTransactionSituation: Situation,
        FinancialTransactionType: Type,
        FinancialTransactionFrequency: Frequency
    } = Database.$Enums
    export type TypeOccurrence = keyof typeof TypeOccurrence
    export type Frequency = keyof typeof Frequency
    export type Situation = keyof typeof Situation
    export type Type = keyof typeof Type

    export type FinancialTransaction = Database.FinancialTransaction
    export type Model = DocumentSimple<FinancialTransaction>
    export type UpdateArgs = Partial<Omit<Model, 'bankAccountId' | 'countRepeatedOccurrences' | 'type' | 'value' | 'timesToRepeat' | 'countRepeatedOccurrences' | 'typeOccurrence' | 'frequency'>>
    export type FinancialTransactionWithPayments = FinancialTransaction & {
        payments: PaymentModel.Payment[]
    }
    export type FinancialTransactionWithCategories = FinancialTransaction & {
        categories: CategoryModel.Category[]
    }
    export type FinancialTransactionWithNotes = FinancialTransaction & {
        notes: NoteModel.Note[]
    }
    export type FinancialTransactionWithNotesAndCategories = FinancialTransaction & {
        notes: NoteModel.Note[]
        categories: CategoryModel.Category[]
    }
    export type FinancialTransactionWithPaymentsAndNotes = FinancialTransaction & {
        payments: PaymentModel.Payment[]
        notes: NoteModel.Note[]
    }
    export type FinancialTransactionWithPaymentsAndNotesAndCategories = FinancialTransaction & {
        payments: PaymentModel.Payment[]
        notes: NoteModel.Note[]
        categories: CategoryModel.Category[]
    }
}
