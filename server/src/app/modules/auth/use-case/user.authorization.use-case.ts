import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { JWTService } from '@services/jwt.service'
import { SERVER_KEY_SECRET_MASTER } from '@global'
import { PayloadJWTUser } from '@@types'

export type AuthSignInDTOArgs = { Authorization: string }

@Service({ name: 'auth.user.use-case.authorization' })
export class AuthUserAuthorizationUseCase {
    constructor(@Injection.Inject('jwt') private jwt: JWTService) {}

    perform({ Authorization }: AuthSignInDTOArgs) {
        const payloadResult = this.jwt.valid<PayloadJWTUser>(Authorization, { secretKey: SERVER_KEY_SECRET_MASTER, name: 'Authorization User' })

        return Result.success(payloadResult.getValue())
    }
}