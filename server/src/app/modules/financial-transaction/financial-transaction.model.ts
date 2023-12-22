import * as Database from '@services/database.service'
import { DocumentSimple } from '@@types/index'

export namespace FinancialTransactionModel {
    export const { FinancialTransactionOccurrence: Occurrence, FinancialTransactionSituation: Situation, FinancialTransactionType: Type } = Database.$Enums

    export type FinancialTransaction = Database.FinancialTransaction
    export type Model = DocumentSimple<FinancialTransaction>
}
