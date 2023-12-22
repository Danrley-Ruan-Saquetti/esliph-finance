import { ValidatorService } from '@services/validator.service'
import { getEnv, toCapitalise } from '@util'

export const GLOBAL_APP = {
    name: getEnv({ name: 'APP_NAME', defaultValue: '' }),
    mail: getEnv({ name: 'APP_MAIL', defaultValue: '' }),
}

export const GLOBAL_SERVER_JWT_TOKEN = {
    keyMaster: getEnv({ name: 'SERVER_JWT_TOKEN_KEY_MASTER', defaultValue: '' }),
    keyBank: getEnv({ name: 'SERVER_JWT_TOKEN_KEY_BANK', defaultValue: '' }),
    expiresTime: getEnv({ name: 'SERVER_JWT_TOKEN_EXPIRES_TIME', defaultValue: '' }),
}

export const GLOBAL_MAIL_CONFIG = {
    host: getEnv({ name: 'MAIL_CONFIG_HOST', defaultValue: '' }),
    port: getEnv<number>({ name: 'MAIL_CONFIG_PORT', defaultValue: 0 }),
    secure: getEnv<boolean>({ name: 'MAIL_CONFIG_SECURE', defaultValue: true }),
    service: getEnv({ name: 'MAIL_CONFIG_SERVICE', defaultValue: '' }),
    mail: getEnv({ name: 'MAIL_CONFIG_EMAIL', defaultValue: '' }),
    pass: getEnv({ name: 'MAIL_CONFIG_PASS', defaultValue: '' }),
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
