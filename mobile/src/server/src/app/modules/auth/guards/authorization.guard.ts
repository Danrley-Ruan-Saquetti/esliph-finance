import { Request } from '@esliph/util-node/dist/lib/http/server/handler/request'
import { Response } from '@esliph/util-node/dist/lib/http/server/handler/response'
import { Guard } from 'src/common/guard'
import { AuthService } from '../auth.service'

class AuthorizationGuardImplementation extends Guard {
    private static readonly service = new AuthService()

    static async perform(req: Request, res: Response) {
        const response = await AuthorizationGuardImplementation.validate(req)

        AuthorizationGuardImplementation.response(response, res)
    }

    protected static async validate(req: Request) {
        const response = await this.service.authorization(req.body)

        return response
    }
}

export const AuthorizationGuard = AuthorizationGuardImplementation.perform
