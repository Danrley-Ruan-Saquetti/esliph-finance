import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { JWTService } from '@services/jwt.service'
import { UnauthorizedException } from '@common/exceptions'
import { SERVER_KEY_SECRET } from '@global'
import { PayloadJWTUser } from '@@types'

export type AuthSignInDTOArgs = { token: string }

@Service({ name: 'auth.use-case.create' })
export class AuthAuthorizationUseCase {
    constructor(
        @Injection.Inject('jwt') private jwt: JWTService,
    ) { }

    perform({ token: AuthorizationToken }: AuthSignInDTOArgs) {
        if (!AuthorizationToken) {
            throw new UnauthorizedException({ message: 'Authorization token not defined' })
        }

        if (AuthorizationToken.split(' ').length != 2) {
            throw new UnauthorizedException({ message: 'Authorization token not defined' })
        }

        const [bearer, token] = AuthorizationToken.split(' ')

        if (bearer !== 'Bearer') {
            throw new UnauthorizedException({ message: 'Authorization token invalid' })
        }

        try {
            const payload = this.jwt.decode<PayloadJWTUser>(token, SERVER_KEY_SECRET)

            return Result.success(payload)
        } catch (err: any) {
            throw new UnauthorizedException({ message: 'Authorization token invalid' })
        }
    }
}
