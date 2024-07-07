import { FastifyReply, FastifyRequest } from 'fastify'
import { PayloadJWTCustomer, PayloadJWTBankAccount } from '@@types'

export type Request = FastifyRequest
export type Response = FastifyReply

declare module 'fastify' {
    export interface FastifyRequest {
        user?: PayloadJWTCustomer
        bankAccount?: PayloadJWTBankAccount
    }
}