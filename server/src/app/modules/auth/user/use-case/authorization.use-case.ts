import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { JWTService } from '@services/jwt.service'
import { GLOBAL_SERVER_JWT_TOKEN } from '@global'
import { UseCase } from '@common/use-case'
import { PayloadJWTUser } from '@@types'

export type AuthSignInDTOArgs = { Authorization: string }

@Service({ name: 'auth.user.use-case.authorization' })
export class AuthUserAuthorizationUseCase extends UseCase {
    constructor(@Injection.Inject('jwt') private jwt: JWTService) {
        super()
    }

    perform({ Authorization }: AuthSignInDTOArgs) {
        const payloadResult = this.jwt.valid<PayloadJWTUser>(Authorization, { secretKey: GLOBAL_SERVER_JWT_TOKEN.keyMaster, name: 'Authorization User' })

        return Result.success(payloadResult.getValue())
    }
}
