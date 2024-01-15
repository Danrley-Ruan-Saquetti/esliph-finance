import { GLOBAL_DTO } from '@global'

export const GLOBAL_NOTIFICATION_DTO = {
    id: GLOBAL_DTO.id.schema({ name: 'Notification' }),
    bankAccount: {
        id: GLOBAL_DTO.id.schema({ name: 'Bank Account' })
    }
}
