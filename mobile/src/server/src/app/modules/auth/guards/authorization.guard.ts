import { HttpEsliph, Result } from '@esliph/util-node'
import { Guard } from '../../../../common/guard'
import { AuthService } from '../auth.service'
import { Inversion } from '../../../../core/injection'

export class AuthorizationGuard extends Guard {
    constructor(@Inversion.Inject('AuthService') private readonly service: AuthService) {
        super()
    }

    static initComponents(): void {
        Inversion.container.bind('AuthorizationGuard').to(AuthorizationGuard)
    }

    async perform(req: HttpEsliph.Request, res: HttpEsliph.Response) {
        const response = await this.service.authorization({ Authorization: req.headers.Authorization })

        if (response.isSuccess()) {
            req.headers.account = response.getValue().sub
        }

        AuthorizationGuard.response(Result.inherit({ ...response.getResponse(), value: null }), res)
    }
}
