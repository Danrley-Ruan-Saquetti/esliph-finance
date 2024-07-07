import { DTO } from '@util/dto'

export const GLOBAL_AUTH_DTO = {
    login: {
        messageRequired: DTO.required('Login')
    },
    token: {
        messageRequired: DTO.required('Token Authentication')
    }
}