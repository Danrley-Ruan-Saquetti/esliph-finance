import { HttpEsliph, Result } from '@esliph/util-node'
import { Guard } from '../../../../common/guard'
import { AuthService } from '../auth.service'
import { Inversion } from '../../../../core/injection'

@Inversion.Injectable('AuthorizationGuard')
export class AuthorizationGuard extends Guard {

    static async perform(req: HttpEsliph.Request, res: HttpEsliph.Response) {
        const authService = Inversion.getInstance<AuthService>('AuthService')

        const response = await authService.authorization({ Authorization: req.headers.Authorization })

        if (response.isSuccess()) {
            req.headers.account = response.getValue().sub
        }

        AuthorizationGuard.response(Result.inherit({ ...response.getResponse(), value: null }), res)
    }
}
