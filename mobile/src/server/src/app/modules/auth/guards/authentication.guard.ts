import { Request } from '@esliph/util-node/dist/lib/http/server/handler/request'
import { Guard } from 'src/common/guard'
import { AuthService } from '../auth.service'

class AuthenticationGuardImplementation extends Guard {
    private static readonly service = new AuthService()

    protected static async validate(req: Request<any>) {
        const response = await this.service.authentication(req.body)

        return response
    }
}

export const AuthenticationGuard = AuthenticationGuardImplementation.perform
