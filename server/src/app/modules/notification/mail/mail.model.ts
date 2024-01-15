import * as Database from '@services/database.service'
import { DocumentSimple } from '@@types'

export namespace MailModel {
    export type Mail = Database.Mail
    export type Model = DocumentSimple<Mail>
    export type CreateArgs = Pick<Model, 'recipient' | 'sender'>
}
