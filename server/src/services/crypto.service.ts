import { Service } from '@core'
import crypto from 'node:crypto'
import bcrypto from 'bcrypt'

@Service({ name: 'global.service.crypto' })
export class CryptoService {
    crypto = crypto
    bcrypto = bcrypto
}
