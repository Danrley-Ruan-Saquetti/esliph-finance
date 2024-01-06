import { Injection } from '@esliph/injection'
import { ValidatorService } from '@services/validator.service'
import { getEnv, toCapitalise } from '@util'
import { DateService } from '@services/date.service'

export const GLOBAL_APP = {
    name: getEnv<string>({ name: 'APP_NAME' }),
    mail: getEnv<string>({ name: 'APP_MAIL' }),
}

export const GLOBAL_SERVER_JWT_TOKEN = {
    keyMaster: getEnv<string>({ name: 'SERVER_JWT_TOKEN_KEY_MASTER' }),
    keyBank: getEnv<string>({ name: 'SERVER_JWT_TOKEN_KEY_BANK' }),
    expiresTime: getEnv<string>({ name: 'SERVER_JWT_TOKEN_EXPIRES_TIME' }),
}

export const GLOBAL_MAIL_CONFIG = {
    host: getEnv<string>({ name: 'MAIL_CONFIG_HOST' }),
    port: getEnv<number>({ name: 'MAIL_CONFIG_PORT', defaultValue: 0 }),
    secure: getEnv<boolean>({ name: 'MAIL_CONFIG_SECURE', defaultValue: true }),
    service: getEnv<string>({ name: 'MAIL_CONFIG_SERVICE' }),
    mail: getEnv<string>({ name: 'MAIL_CONFIG_EMAIL' }),
    pass: getEnv<string>({ name: 'MAIL_CONFIG_PASS' }),
}

export const GLOBAL_OUTPUT = {
    path: getEnv<string>({ name: 'OUTPUT_PATH', defaultValue: 'output', defaultValueInProduction: true })
}

export const GLOBAL_LOG_CONFIG = {
    path: `${GLOBAL_OUTPUT.path}/logs`,
    enableLog: getEnv<boolean>({ name: 'ENABLE_LOG', defaultValue: false })
}

export const GLOBAL_FORMATTER_CONFIG = {
    date: {
        formatter: new Intl.DateTimeFormat(undefined, {
            hour12: false,
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            day: '2-digit',
            month: '2-digit',
            calendar: 'gregory',
        }),
        format: (date = new Date(Date.now())) => GLOBAL_FORMATTER_CONFIG.date.formatter.format(date).replace(', ', ' ')
    }
}

export const GLOBAL_DTO = {
    required: (value: string) => `${toCapitalise(value)} is required`,
    text: {
        transform: val => val.replace(/ {2}/g, ' '),
    },
    date: {
        schema: ValidatorService.schema
            .coerce
            .date()
            .transform(date => {
                const dateService = Injection.resolve(DateService)

                return dateService.converterToUTC(date)
            }),
        transform: date => {
            const dateService = Injection.resolve(DateService)

            return dateService.converterToUTC(date)
        },
    },
    color: {
        regex: /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
        messageRegex: 'Color hexadecimal is invalid',
        transform: (color: string) => color.toUpperCase()
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
    query: {
        pagination: {
            pageIndex: () => ValidatorService.schema.coerce
                .number({ 'required_error': GLOBAL_DTO.required('Page Index'), 'invalid_type_error': 'Type Page Index must be a number' }).default(1),
            limite: () => ValidatorService.schema.coerce
                .number({ 'required_error': GLOBAL_DTO.required('Limite of the Registers'), 'invalid_type_error': 'Type Limite of the registers must be a number' }).default(15)
        }
    }
}