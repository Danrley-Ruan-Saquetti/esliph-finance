import { getEnv } from '@util'

export const SERVER_KEY_SECRET_MASTER = getEnv({ name: 'SERVER_KEY_SECRET_MASTER', defaultValue: '' })
export const SERVER_KEY_SECRET_BANK = getEnv({ name: 'SERVER_KEY_SECRET_BANK', defaultValue: '' })
export const JWT_EXPIRES_TIME = '1d'
