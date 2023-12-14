import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { PayloadJWTUserBankAccount } from '@@types'
import { GLOBAL_SERVER_JWT_TOKEN } from '@global'
import { JWTService } from '@services/jwt.service'

export type AuthSignInDTOArgs = { AuthorizationBankAccount: string }

@Service({ name: 'auth.bank-account.use-case.authorization' })
export class AuthBankAccountAuthorizationUseCase {
    constructor(@Injection.Inject('jwt') private jwt: JWTService) { }

    perform({ AuthorizationBankAccount }: AuthSignInDTOArgs) {
        const payloadResult = this.jwt.valid<PayloadJWTUserBankAccount>(AuthorizationBankAccount, {
            secretKey: GLOBAL_SERVER_JWT_TOKEN.keyBank,
            name: 'Authorization Bank Account',
        })

        return Result.success(payloadResult.getValue())
    }
}
