import JWT from 'jsonwebtoken'
import { GenericObject } from '@util/types'
import { BadRequestException } from '@exceptions/bad-request'
import { UnauthorizedException } from '@exceptions/unauthorized'
import { ServerInternalErrorException } from '@exceptions/server-internal-error'

export type PayloadJWT<PayloadBody extends object = {}> = PayloadBody & {
    iat: number
    exp: number
}

export class JWTService<PayloadBody extends GenericObject = {}> {
    constructor(
        private secret: string,
        private name: string,
        private exp: string
    ) { }

    valid(token: string) {
        return JWTService.valid<PayloadBody>(token, {
            name: this.name,
            secret: this.secret
        })
    }

    encode(payload: GenericObject) {
        return JWTService.encode(payload, {
            secret: this.secret,
            exp: this.exp,
        })
    }

    decode(token: string) {
        return JWTService.decode<PayloadBody>(token, this.secret)
    }

    static valid<PayloadBody extends GenericObject = {}>(Token: string, options: { secret: string; name: string }) {
        if (!Token)
            throw new UnauthorizedException({ title: 'Unauthorized', message: `${options.name} token not defined` })

        if (Token.split(' ').length != 2)
            throw new UnauthorizedException({ title: 'Unauthorized', message: `${options.name} token invalid` })

        const [bearer, token] = Token.split(' ')

        if (bearer !== 'Bearer')
            throw new UnauthorizedException({ title: 'Unauthorized', message: `${options.name} token invalid` })

        try {
            return this.decode<PayloadBody>(token, options.secret)
        } catch (err: any) {
            throw new UnauthorizedException({ title: 'Unauthorized', message: `${options.name} token invalid` })
        }
    }

    static encode(payload: GenericObject, { exp, secret }: { secret: string; exp: string }) {
        try {
            return JWT.sign(payload, secret, { algorithm: 'HS256', expiresIn: exp })
        } catch (err: any) {
            throw new BadRequestException({ title: 'Generate Token', message: 'Unable to generate token' })
        }
    }

    static decode<PayloadBody extends GenericObject = {}>(token: string, secret: string) {
        try {
            return JWT.verify(token, secret) as PayloadJWT<PayloadBody>
        } catch (err: any) {
            if (err instanceof JWT.JsonWebTokenError)
                throw new BadRequestException({ title: 'Verify Token', message: 'Token access invalid' })

            throw new ServerInternalErrorException({ title: 'Verify Token', ...err })
        }
    }
}
