import { GLOBAL_DTO } from '@global'
import { NotificationModel } from '@modules/notification/notification.model'

export const GLOBAL_NOTIFICATION_DTO = {
    id: GLOBAL_DTO.id.schema({ name: 'Notification' }),
    bankAccount: {
        id: GLOBAL_DTO.id.schema({ name: 'Bank Account' })
    },
    content: {
        messageRequired: GLOBAL_DTO.required('Content')
    },
    subject: {
        messageRequired: GLOBAL_DTO.required('Subject')
    },
    type: {
        enum: [NotificationModel.Type.Internal, NotificationModel.Type.Mail, NotificationModel.Type.Push] as const,
        messageRequired: GLOBAL_DTO.required('Type'),
        messageEnumInvalid: 'Type of the notification must be Internal, Mail or Push'
    },
}
