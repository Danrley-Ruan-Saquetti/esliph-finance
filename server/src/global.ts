import { getEnv } from '@util'

export const SERVER_KEY_SECRET = getEnv({ name: 'SERVER_KEY_SECRET', defaultValue: '' })
export const JWT_EXPIRES_TIME = '1d'