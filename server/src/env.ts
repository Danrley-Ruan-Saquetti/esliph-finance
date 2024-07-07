import { z, Validator } from '@services/validator'

const schemaEnv = z.object({
    PORT: z.coerce.number().int(),
    SERVER_KEY: z.string(),
    TZ: z.string(),
    ENVIRONMENT: z.string().default('PRODUCTION'),
    SERVER_JWT_TOKEN_KEY_CUSTOMER: z.string(),
    SERVER_JWT_TOKEN_KEY_MASTER: z.string(),
    SERVER_JWT_TOKEN_KEY_BANK: z.string(),
    SERVER_JWT_TOKEN_KEY_RESET_PASSWORD: z.string(),
    SERVER_JWT_TOKEN_AUTHENTICATION_EXPIRES_TIME: z.string(),
    SERVER_JWT_TOKEN_RESET_PASSWORD_EXPIRES_TIME: z.string(),
})

const result = Validator.parse(process.env as any, schemaEnv)

if (!result.isSuccess()) {
    console.log(result.getError())
    process.exit(1)
}

export const ENV = result.getValue()
