import jwt from 'jsonwebtoken'
import { PayloadAuthorization } from '../@types/payload-authorization'
import { Result } from '@esliph/util-node'
import { UnauthorizedException } from '../common/exception'
// import jwt from 'expo-jwt'

const KEY_SECRET = 'safdfgd dg dfgefra'
const timeExpInOneDay = 60 * 60 * 24

export class Token {
    static sign(payload: { sub: number; login: string; name: string }) {
        return jwt.sign(payload, KEY_SECRET, { expiresIn: '24h' })
        // return jwt.encode(payload, KEY_SECRET, {})
    }

    static verify(token: string) {
        try {
            return Result.success<PayloadAuthorization>(jwt.verify(token, KEY_SECRET) as any)
            // return Result.success<PayloadAuthorization>(jwt.decode(token, KEY_SECRET, { exp: timeExpInOneDay }) as any)
        } catch (err) {
            return Result.inherit<PayloadAuthorization>(new UnauthorizedException({ description: 'Token de autorização inválido' }))
        }
    }
}
