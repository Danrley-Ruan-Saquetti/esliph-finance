import { Service } from '@esliph/module'
import JWT from 'jsonwebtoken'
import { BadRequestException, ServerInternalErrorException, UnauthorizedException } from '@common/exceptions'
import { Result } from '@esliph/common'

export type PayloadJWT<PayloadBody extends object = {}> = PayloadBody & {
    iat: number
    exp: number
}

@Service({ name: 'global.service.jwt' })
export class JWTService {
    constructor() {}

    valid<PayloadBody extends { [x: string]: any } = {}>(Token: string, options: { secretKey: string; name: string }) {
        if (!Token) {
            throw new UnauthorizedException({ message: `${options.name} token not defined` })
        }

        if (Token.split(' ').length != 2) {
            throw new UnauthorizedException({ message: `${options.name} token not defined` })
        }

        const [bearer, token] = Token.split(' ')

        if (bearer !== 'Bearer') {
            throw new UnauthorizedException({ message: `${options.name} token invalid` })
        }

        try {
            const payload = this.decode<PayloadBody>(token, options.secretKey)

            return Result.success(payload)
        } catch (err: any) {
            throw new UnauthorizedException({ message: `${options.name} token invalid` })
        }
    }

    encode<PayloadBody extends { [x: string]: any }>(payload: PayloadBody, config: { secret: string; exp: string }) {
        const token = JWT.sign(payload, config.secret, { algorithm: 'HS256', expiresIn: config.exp })

        return token
    }

    decode<PayloadBody extends { [x: string]: any } = {}>(token: string, secret: string) {
        try {
            const payload = JWT.verify(token, secret)

            return payload as PayloadJWT<PayloadBody>
        } catch (err: any) {
            if (err instanceof JWT.JsonWebTokenError) {
                throw new BadRequestException({ title: 'Verify Token', message: 'Token access inválid' })
            }

            throw new ServerInternalErrorException({ ...err })
        }
    }
}
