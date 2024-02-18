import { Injection } from '@core'
import { ValidatorService } from '@services/validator.service'
import { getEnv, toCapitalise } from '@util'
import { DateService } from '@services/date.service'
import { REGEX_CNPJ } from '@util'
import { z } from 'zod'

export const GLOBAL_APP = {
    name: getEnv<string>({ name: 'APP_NAME' }),
    mail: getEnv<string>({ name: 'APP_MAIL' }),
}

export const GLOBAL_SERVER = {
    key: getEnv<string>({ name: 'SERVER_KEY' }),
}

export const GLOBAL_SERVER_JWT_TOKEN = {
    keyCustomer: getEnv<string>({ name: 'SERVER_JWT_TOKEN_KEY_CUSTOMER' }),
    keyMaster: getEnv<string>({ name: 'SERVER_JWT_TOKEN_KEY_MASTER' }),
    keyBank: getEnv<string>({ name: 'SERVER_JWT_TOKEN_KEY_BANK' }),
    keyResetPassword: getEnv<string>({ name: 'SERVER_JWT_TOKEN_KEY_RESET_PASSWORD' }),
    authenticationExpiresTime: getEnv<string>({ name: 'SERVER_JWT_TOKEN_AUTHENTICATION_EXPIRES_TIME' }),
    resetPasswordExpiresTime: getEnv<string>({ name: 'SERVER_JWT_TOKEN_RESET_PASSWORD_EXPIRES_TIME' }),
}

export const GLOBAL_MAIL_CONFIG = {
    apiKey: getEnv<string>({ name: 'MAIL_API_KEY' }),
    domain: getEnv<string>({ name: 'MAIL_DOMAIN' })
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
        transform: (val: string) => val.replace(/ {2,}/g, ' '),
    },
    date: {
        schema: ValidatorService.schema
            .coerce
            .date({ 'invalid_type_error': 'Date format invalid' })
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
        limitePerPage: 100,
        pagination: {
            pageIndex: () => ValidatorService.schema
                .coerce
                .number({ 'required_error': GLOBAL_DTO.required('Page Index'), 'invalid_type_error': 'Type Page Index must be a number' })
                .min(0, { message: 'Page index must be biggest than 0' })
                .default(0),
            limite: () => ValidatorService.schema
                .coerce
                .number({ 'required_error': GLOBAL_DTO.required('Limite of the Registers'), 'invalid_type_error': 'Type Limite of the registers must be a number' })
                .min(0, { message: 'The limit of the registers must be biggest than 0' })
                .max(GLOBAL_DTO.query.limitePerPage, { message: `The limit of the registers must be less than ${GLOBAL_DTO.query.limitePerPage}` })
                .default(10),
            orderBy: () => ValidatorService.schema
                .union([
                    ValidatorService.schema.object({}),
                    ValidatorService.schema.array(ValidatorService.schema.object({})),
                ])
                .default([{}])
                .transform(val => Array.isArray(val) ? val : [val])
        },
        schema: () => ValidatorService.schema.object({
            pageIndex: GLOBAL_DTO.query.pagination.pageIndex(),
            limite: GLOBAL_DTO.query.pagination.limite(),
            orderBy: GLOBAL_DTO.query.pagination.orderBy(),
        })
    },
    cnpj: {
        regex: REGEX_CNPJ
    }
}

const schema = ValidatorService.schema.object({
    orderBy: GLOBAL_DTO.query.pagination.orderBy()
})

type a = z.input<typeof schema>
type b = z.output<typeof schema>

console.log(schema.parse({ orderBy: [{}] }))

export const GLOBAL_RULES_BUSINESS = {
    repeatTransactionPerTime: 3
}
