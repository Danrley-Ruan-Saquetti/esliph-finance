import { HttpEsliph, Result } from '@esliph/util-node'
import { Guard } from '../../../../common/guard'
import { AuthService } from '../auth.service'

class AuthorizationGuardImplementation extends Guard {
    private static readonly service = new AuthService()

    static async perform(req: HttpEsliph.Request, res: HttpEsliph.Response) {
        const response = await AuthorizationGuardImplementation.validate(req)

        AuthorizationGuardImplementation.response(response, res)
    }

    protected static async validate(req: HttpEsliph.Request) {
        const response = await this.service.authorization({ Authorization: req.headers.Authorization })

        if (response.isSuccess()) {
            req.headers.account = response.getValue().sub
        }

        return Result.inherit({ ...response.getResponse(), value: null })
    }
}

export const AuthorizationGuard = AuthorizationGuardImplementation.perform
