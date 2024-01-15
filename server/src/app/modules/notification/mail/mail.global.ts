import { GLOBAL_DTO } from '@global'

export const GLOBAL_MAIL_DTO = {
    id: GLOBAL_DTO.id.schema({ name: 'Mail' }),
    recipient: {
        messageRequired: GLOBAL_DTO.required('Recipient')
    },
    sender: {
        messageRequired: GLOBAL_DTO.required('Sender')
    },
}
