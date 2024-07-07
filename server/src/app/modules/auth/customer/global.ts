import { PayloadJWTCustomer, PayloadJWTCustomerBankAccount } from '@@types'
import { DTO } from '@util/dto'
import { JWTService } from '@services/jwt'

export const jwtServiceCustomer = new JWTService<PayloadJWTCustomer>(
    DTO.GLOBAL_SERVER_JWT_TOKEN.keyCustomer,
    'Authorization Customer',
    DTO.GLOBAL_SERVER_JWT_TOKEN.authenticationExpiresTime
)

export const jwtServiceBankAccount = new JWTService<PayloadJWTCustomerBankAccount>(
    DTO.GLOBAL_SERVER_JWT_TOKEN.keyBankAccount,
    'Authorization Bank Account',
    DTO.GLOBAL_SERVER_JWT_TOKEN.authenticationExpiresTime
)