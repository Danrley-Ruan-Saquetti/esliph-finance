import { Result, Injection, Service } from '@core'
import { PayloadJWTCustomerBankAccount } from '@@types'
import { GLOBAL_SERVER_JWT_TOKEN } from '@global'
import { UseCase } from '@common/use-case'
import { JWTService } from '@services/jwt.service'

export type AuthSignInDTOArgs = { AuthorizationBankAccount: string }

@Service({ name: 'auth.bank-account.use-case.authorization' })
export class AuthBankAccountAuthorizationUseCase extends UseCase {
    constructor(@Injection.Inject('jwt') private jwt: JWTService) {
        super()
    }

    perform({ AuthorizationBankAccount }: AuthSignInDTOArgs) {
        const payloadResult = this.jwt.valid<PayloadJWTCustomerBankAccount>(AuthorizationBankAccount, {
            secretKey: GLOBAL_SERVER_JWT_TOKEN.keyBank,
            name: 'Authorization Bank Account',
        })

        return Result.success(payloadResult.getValue())
    }
}
