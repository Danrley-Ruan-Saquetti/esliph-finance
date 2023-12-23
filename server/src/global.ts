import { ValidatorService } from '@services/validator.service'
import { getEnv, toCapitalise } from '@util'

export const GLOBAL_APP = {
    name: getEnv({ name: 'APP_NAME' }),
    mail: getEnv({ name: 'APP_MAIL' }),
}

export const GLOBAL_SERVER_JWT_TOKEN = {
    keyMaster: getEnv({ name: 'SERVER_JWT_TOKEN_KEY_MASTER' }),
    keyBank: getEnv({ name: 'SERVER_JWT_TOKEN_KEY_BANK' }),
    expiresTime: getEnv({ name: 'SERVER_JWT_TOKEN_EXPIRES_TIME' }),
}

export const GLOBAL_MAIL_CONFIG = {
    host: getEnv<string>({ name: 'MAIL_CONFIG_HOST' }),
    port: getEnv<number>({ name: 'MAIL_CONFIG_PORT', defaultValue: 0 }),
    secure: getEnv<boolean>({ name: 'MAIL_CONFIG_SECURE', defaultValue: true }),
    service: getEnv({ name: 'MAIL_CONFIG_SERVICE' }),
    mail: getEnv({ name: 'MAIL_CONFIG_EMAIL' }),
    pass: getEnv({ name: 'MAIL_CONFIG_PASS' }),
}

export const GLOBAL_LOG_CONFIG = {
    path: getEnv<string>({ name: 'OUTPUT_PATH_LOG' }),
    dbPath: getEnv<string>({ name: 'OUTPUT_PATH_LOG_DATABASE' })
}

export const GLOBAL_DTO = {
    required: (value: string) => `${toCapitalise(value)} is required`,
    text: {
        transform: val => val.replace(/ {2}/g, ' '),
    },
    color: {
        regex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
        messageRegex: 'Color hexadecimal is invalid',
    },
    number: {
        messageInvalidType: (value: string) => `${toCapitalise(value)} must be a number`,
    },
    id: {
        schema: ({ name }: { name: string }) =>
            ValidatorService.schema.coerce
                .number({ 'required_error': GLOBAL_DTO.required(`ID ${name}`), 'invalid_type_error': `Type ID ${name} must be a number` })
                .positive({ message: `Invalid ID ${toCapitalise(name)}` }),
    },
}
