import { Request } from '@esliph/util-node/dist/lib/http/server/handler/request'
import { Response } from '@esliph/util-node/dist/lib/http/server/handler/response'
import { Guard } from 'src/common/guard'
import { AuthService } from '../auth.service'

class AuthenticationGuardImplementation extends Guard {
    private static readonly service = new AuthService()

    static async perform(req: Request, res: Response) {
        const response = await AuthenticationGuardImplementation.validate(req)

        AuthenticationGuardImplementation.response(response, res)
    }

    protected static async validate(req: Request) {
        const response = await this.service.authentication(req.body)

        return response
    }
}

export const AuthenticationGuard = AuthenticationGuardImplementation.perform
