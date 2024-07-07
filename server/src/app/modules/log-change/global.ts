import { DTO } from '@util/dto'

export const GLOBAL_LOG_DTO = {
    id: DTO.id.schema({ name: 'Log' }),
    operation: {
        messageRequired: DTO.required('Operation')
    },
    data: {
        messageRequired: DTO.required('Data')
    },
    origin: {
        messageRequired: DTO.required('Origin')
    },
    dateTime: {
        default: (date = Date.now()) => new Date(date)
    },
}
