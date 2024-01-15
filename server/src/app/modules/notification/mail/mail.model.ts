import * as Database from '@services/database.service'
import { DocumentSimple } from '@@types'
import { NotificationModel } from '@modules/notification/notification.model'

export namespace MailModel {
    export type Mail = Database.Mail
    export type Model = DocumentSimple<Mail>
    export type CreateArgs = Pick<Model, 'recipient' | 'sender'>

    export type MailWithNotification = Mail & {
        notification: NotificationModel.Notification
    }
}
