import * as Database from '@services/database.service'
import { DocumentSimple } from '@@types'

export namespace NotificationModel {
    export const {
        NotificationType: Type,
        NotificationSituation: Situation,
    } = Database.$Enums

    export type Type = keyof typeof Type
    export type Situation = keyof typeof Situation

    export type Notification = Database.Notification
    export type Model = DocumentSimple<Notification>
    export type UpdateArgs = Partial<Omit<Model, 'bankAccountId' | 'content' | 'subject'>>
    export type CreateArgs = Pick<Model, 'bankAccountId' | 'content' | 'subject' | 'type'>
}
