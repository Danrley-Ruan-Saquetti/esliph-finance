import { Result, Injection, Service } from '@core'
import { JWTService } from '@services/jwt.service'
import { GLOBAL_SERVER_JWT_TOKEN } from '@global'
import { UseCase } from '@common/use-case'
import { PayloadJWTCustomer } from '@@types'

export type AuthSignInDTOArgs = { Authorization: string }

@Service({ name: 'auth.customer.use-case.authorization' })
export class AuthCustomerAuthorizationUseCase extends UseCase {
    constructor(@Injection.Inject('jwt') private jwt: JWTService) {
        super()
    }

    perform({ Authorization }: AuthSignInDTOArgs) {
        const payloadResult = this.jwt.valid<PayloadJWTCustomer>(Authorization, { secretKey: GLOBAL_SERVER_JWT_TOKEN.keyCustomer, name: 'Authorization Customer' })

        return Result.success(payloadResult.getValue())
    }
}
