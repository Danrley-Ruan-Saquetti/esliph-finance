import { Injection } from '@core'
import { getEnv, isArray, toCapitalise, REGEX_CNPJ } from '@util'
import { SchemaValidator } from '@services/validator.service'
import { DateService } from '@services/date.service'

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
        schema: SchemaValidator
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
            SchemaValidator.coerce
                .number({ 'required_error': GLOBAL_DTO.required(`ID ${name}`), 'invalid_type_error': `Type ID ${name} must be a number` })
                .positive({ message: `Invalid ID ${toCapitalise(name)}` }),
    },
    query: {
        limitePerPage: 100,
        pagination: {
            pageIndex: () => SchemaValidator
                .coerce
                .number({ 'required_error': GLOBAL_DTO.required('Page Index'), 'invalid_type_error': 'Type Page Index must be a number' })
                .min(1, { message: 'Page index must be biggest than 1' })
                .default(1)
                .transform(page => page - 1),
            limite: () => SchemaValidator
                .coerce
                .number({ 'required_error': GLOBAL_DTO.required('Limite of the Registers'), 'invalid_type_error': 'Type Limite of the registers must be a number' })
                .min(0, { message: 'The limit of the registers must be biggest than 0' })
                .max(GLOBAL_DTO.query.limitePerPage, { message: `The limit of the registers must be less than ${GLOBAL_DTO.query.limitePerPage}` })
                .default(10),
            orderBy: (orders: string[] = []) => {
                const schemaOrderByObject = {}

                orders.forEach(key => {
                    schemaOrderByObject[key] = SchemaValidator
                        .enum(
                            ['asc', 'desc'],
                            { errorMap: () => ({ message: `Invalid enum to param "orderBy.${key}". Expect "asc, desc"` }) }
                        )
                        .optional()
                })

                return SchemaValidator
                    .union([
                        SchemaValidator.object(schemaOrderByObject),
                        SchemaValidator.array(SchemaValidator.object(schemaOrderByObject)),
                    ])
                    .default([])
                    .transform(val => isArray(val) ? [...val] : [val])
            }
        },
        schema: (orders: string[] = []) => SchemaValidator.object({
            pageIndex: GLOBAL_DTO.query.pagination.pageIndex(),
            limite: GLOBAL_DTO.query.pagination.limite(),
            orderBy: GLOBAL_DTO.query.pagination.orderBy(orders),
        })
    },
    cnpj: {
        regex: REGEX_CNPJ
    }
}