import { HttpEsliph, Result } from '@esliph/util-node'
import { Guard } from '../../../../common/guard'
import { AuthService } from '../auth.service'

export class AuthorizationGuard extends Guard {
    static async perform(req: HttpEsliph.Request, res: HttpEsliph.Response) {
        const authService = new AuthService()

        const response = await authService.authorization({ Authorization: req.headers.Authorization })

        if (response.isSuccess()) {
            req.headers.account = response.getValue().sub
        }

        AuthorizationGuard.response(Result.inherit({ ...response.getResponse(), value: null }), res)
    }
}
