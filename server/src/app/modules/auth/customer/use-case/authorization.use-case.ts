import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
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
        const payloadResult = this.jwt.valid<PayloadJWTCustomer>(Authorization, { secretKey: GLOBAL_SERVER_JWT_TOKEN.keyMaster, name: 'Authorization Customer' })

        return Result.success(payloadResult.getValue())
    }
}
