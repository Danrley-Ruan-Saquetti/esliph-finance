import * as Database from '@services/database.service'
import { DocumentSimple } from '@@types/index'

export namespace FinancialTransactionModel {
    export const { FinancialTransactionOccurrence: Occurrence, FinancialTransactionSituation: Situation, FinancialTransactionType: Type } = Database.$Enums
    export type Occurrence = keyof typeof Occurrence
    export type Situation = keyof typeof Situation
    export type Type = keyof typeof Type

    export type FinancialTransaction = Database.FinancialTransaction
    export type Model = DocumentSimple<FinancialTransaction>
}

/*
id: number;
bankAccountId: number;
title: string;
description: string;
value: number;
priority: number;
isObservable: boolean;
isSendNotification: boolean;
timesToRepeat: number;
countRepeatedOccurrences: number;
type: $Enums.FinancialTransactionType;
receiver: string;
sender: string;
typeOccurrence: $Enums.FinancialTransactionOccurrence;
situation: $Enums.FinancialTransactionSituation;
expiresIn: Date;
createdAt: Date;
updatedAt: Date;
*/
