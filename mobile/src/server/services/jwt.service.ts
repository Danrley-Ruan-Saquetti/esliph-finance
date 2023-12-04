import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { CryptoService } from '@server/services/crypto.service'

export type PayloadJWT<PayloadBody extends object = {}> = PayloadBody & {
    iat: number
    exp: number
}

@Service({ name: 'global.service.jwt' })
export class JWTService {
    constructor(@Injection.Inject('crypto') private crypto: CryptoService) {}

    async encode<PayloadBody extends { [x: string]: any }>(payload: PayloadBody, config: { secret: string; exp: number }) {
        const header = { alg: 'HS256', typ: 'JWT' }
        const encodedHeader = this.crypto.base64.encode(JSON.stringify(header))

        const nowInSeconds = new Date(Date.now()).getTime() / 1000

        const payloadJwt: PayloadJWT<PayloadBody> = {
            ...payload,
            iat: nowInSeconds,
            exp: nowInSeconds + config.exp,
        }

        const encodedPayload = this.crypto.base64.encode(JSON.stringify(payloadJwt))

        const signature = await this.sign(`${encodedHeader}.${encodedPayload}`, config.secret)

        return `${encodedHeader}.${encodedPayload}.${signature}`
    }

    async decode<PayloadBody extends { [x: string]: any } = {}>(token: string, secret: string) {
        const parts = token.split('.')
        if (parts.length !== 3) {
            throw new Error('Token inválido')
        }

        const encodedHeader = parts[0]
        const encodedPayload = parts[1]
        const signature = parts[2]

        const signedPart = `${encodedHeader}.${encodedPayload}`
        const computedSignature = await this.sign(signedPart, secret)

        if (this.crypto.base64.base64urlUnescape(signature) !== this.crypto.base64.base64urlUnescape(computedSignature)) {
            throw new Error('Assinatura inválida')
        }

        const payload: PayloadJWT<PayloadBody> = JSON.parse(this.crypto.base64.decode(encodedPayload))

        if (payload.exp) {
            this.validTimeStamp(payload.exp)
        }

        return payload
    }

    private validTimeStamp(time: number) {
        const exp = new Date(time * 1000)
        const now = new Date(Date.now())

        if (now > exp) {
            throw new Error('Token expirado')
        }
    }

    private async sign(payload: any, secret: string) {
        const key = await this.crypto.crypto.digestStringAsync(this.crypto.crypto.CryptoDigestAlgorithm.SHA256, JSON.stringify({ payload, secret }), {
            encoding: this.crypto.crypto.CryptoEncoding.BASE64,
        })

        return key.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    }
}
