import * as Database from '@services/database.service'
import { DocumentSimple } from '@@types/index'

export namespace PaymentModel {
    export type Payment = Database.Payment
    export type Model = DocumentSimple<Payment>
}

/*
    id: number;
    financialTransactionId: number;
    value: number;
    discount: number;
    increase: number;
    paidAt: Date;
    createdAt: Date;
*/