import * as Database from '@services/database.service'
import { DocumentSimple } from '@@types/index'

export namespace PaymentModel {
    export type Payment = Database.Payment
    export type Model = DocumentSimple<Payment>
}
