import { Service } from '@esliph/module'
import base64 from 'base-64'
import * as Crypto from 'expo-crypto'

@Service({ name: 'global.service.jwt' })
export class JWTService {
    async encode(payload: { [x: string]: any }, config: { secret: string, exp: number }) {
        const header = { alg: 'HS256', typ: 'JWT' }
        const encodedHeader = base64.encode(JSON.stringify(header))

        const nowInSeconds = new Date(Date.now()).getTime() / 1000

        payload.iat = nowInSeconds
        payload.exp = nowInSeconds + config.exp

        const encodedPayload = base64.encode(JSON.stringify(payload))

        const signature = await this.sign(`${encodedHeader}.${encodedPayload}`, config.secret)

        return `${encodedHeader}.${encodedPayload}.${signature}`
    }

    async decode(token: string, secret: string) {
        const parts = token.split('.')
        if (parts.length !== 3) {
            throw new Error('Token inválido')
        }

        const encodedHeader = parts[0]
        const encodedPayload = parts[1]
        const signature = parts[2]

        const signedPart = `${encodedHeader}.${encodedPayload}`
        const computedSignature = await this.sign(signedPart, secret)

        if (this.base64urlUnescape(signature) !== this.base64urlUnescape(computedSignature)) {
            throw new Error('Assinatura inválida')
        }

        const payload = JSON.parse(base64.decode(encodedPayload))

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
        const key = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            JSON.stringify({ payload, secret }),
            { encoding: Crypto.CryptoEncoding.BASE64 }
        )

        return key.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    }

    private base64urlUnescape(str: string) {
        return str + '==='.slice(0, (4 - str.length % 4) % 4)
    }
}