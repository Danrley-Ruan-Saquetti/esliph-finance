import * as Database from '@services/database.service'
import { DocumentSimple } from '@@types'

export namespace FinancialTransactionModel {
    export const {
        FinancialTransactionTypeOccurrence: TypeOccurrence,
        FinancialTransactionSituation: Situation,
        FinancialTransactionType: Type,
    } = Database.$Enums
    export type TypeOccurrence = keyof typeof TypeOccurrence
    export type Situation = keyof typeof Situation
    export type Type = keyof typeof Type

    export type FinancialTransaction = Database.FinancialTransaction
    export type Model = DocumentSimple<FinancialTransaction>
}