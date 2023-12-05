import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import JWT from 'jsonwebtoken'
import { CryptoService } from '@services/crypto.service'
import { BadRequestException, ServerInternalErrorException } from '@common/exceptions'

export type PayloadJWT<PayloadBody extends object = {}> = PayloadBody & {
    iat: number
    exp: number
}

@Service({ name: 'global.service.jwt' })
export class JWTService {
    constructor(@Injection.Inject('crypto') private crypto: CryptoService) {}

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
