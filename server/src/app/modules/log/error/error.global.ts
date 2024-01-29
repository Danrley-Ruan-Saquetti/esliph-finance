import * as Database from '@services/database.service'
import { GLOBAL_DTO } from '@global'
import { ErrorResult } from '@esliph/common'

export const GLOBAL_LOG_ERROR_DTO = {
    id: GLOBAL_DTO.id.schema({ name: 'Log Error' }),
    title: {
        messageRequired: GLOBAL_DTO.required('Title')
    },
    message: {
        messageRequired: GLOBAL_DTO.required('Message')
    },
    origin: {
        messageRequired: GLOBAL_DTO.required('Origin')
    },
    description: {
        default: ''
    },
    stack: {
        default: ''
    },
    dateTime: {
        default: () => new Date(Date.now()),
    },
    causes: {
        default: [] as Database.Prisma.JsonArray,
        message: {
            messageRequired: GLOBAL_DTO.required('Message Cause')
        },
        cause: {
            default: ''
        }
    },
}