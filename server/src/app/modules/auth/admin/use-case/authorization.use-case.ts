import { Result, Injection, Service } from '@core'
import { JWTService } from '@services/jwt.service'
import { GLOBAL_SERVER_JWT_TOKEN } from '@global'
import { UseCase } from '@common/use-case'
import { PayloadJWTAdmin } from '@@types'

export type AuthSignInDTOArgs = { Authorization: string }

@Service({ name: 'auth.admin.use-case.authorization' })
export class AuthAdminAuthorizationUseCase extends UseCase {
    constructor(@Injection.Inject('jwt') private jwt: JWTService) {
        super()
    }

    perform({ Authorization }: AuthSignInDTOArgs) {
        const payloadResult = this.jwt.valid<PayloadJWTAdmin>(Authorization, { secretKey: GLOBAL_SERVER_JWT_TOKEN.keyMaster, name: 'Authorization Admin' })

        return Result.success(payloadResult.getValue())
    }
}
