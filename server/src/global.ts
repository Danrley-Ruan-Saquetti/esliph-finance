import { getEnv } from '@util'

export const APP = {
    name: getEnv({ name: 'APP_NAME', defaultValue: '' }),
    mail: getEnv({ name: 'APP_MAIL', defaultValue: '' })
}

export const SERVER_JWT_TOKEN = {
    keyMaster: getEnv({ name: 'SERVER_JWT_TOKEN_KEY_MASTER', defaultValue: '' }),
    keyBank: getEnv({ name: 'SERVER_JWT_TOKEN_KEY_BANK', defaultValue: '' }),
    expiresTime: getEnv({ name: 'SERVER_JWT_TOKEN_EXPIRES_TIME', defaultValue: '' }),
}

export const MAIL_CONFIG = {
    host: getEnv({ name: 'MAIL_CONFIG_HOST', defaultValue: '' }),
    port: getEnv<number>({ name: 'MAIL_CONFIG_PORT', defaultValue: 0 }),
    secure: getEnv<boolean>({ name: 'MAIL_CONFIG_SECURE', defaultValue: true }),
    service: getEnv({ name: 'MAIL_CONFIG_SERVICE', defaultValue: '' }),
    mail: getEnv({ name: 'MAIL_CONFIG_EMAIL', defaultValue: '' }),
    pass: getEnv({ name: 'MAIL_CONFIG_PASS', defaultValue: '' }),
}
