import { Service } from '@esliph/module'
import * as base64 from 'base-64'
import * as crypto from 'expo-crypto'
import cryptoES from 'crypto-es'

@Service({ name: 'global.service.crytpo' })
export class CryptoService {
    base64 = {
        ...base64,
        base64urlUnescape(str: string) {
            return str + '==='.slice(0, (4 - (str.length % 4)) % 4)
        },
    }
    crypto = crypto
    cryptoES = cryptoES
}
