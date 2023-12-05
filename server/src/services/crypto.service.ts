import { Service } from '@esliph/module'
import crypto from 'node:crypto'
import bcrypto from 'bcrypt'

@Service({ name: 'global.service.crytpo' })
export class CryptoService {
    crypto = crypto
    bcrypto = bcrypto
}
