import { HttpEsliph } from '@esliph/util-node'
import { Guard } from 'src/common/guard'
import { AuthService } from '../auth.service'

class AuthorizationGuardImplementation extends Guard {
    private static readonly service = new AuthService()

    static async perform(req: HttpEsliph.Request, res: HttpEsliph.Response) {
        const response = await AuthorizationGuardImplementation.validate(req)

        AuthorizationGuardImplementation.response(response, res)
    }

    protected static async validate(req: HttpEsliph.Request) {
        const response = await this.service.authorization({ Authorization: req.headers.Authorization })

        return response
    }
}

export const AuthorizationGuard = AuthorizationGuardImplementation.perform
