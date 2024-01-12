import { Request, Response } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Filter, FilterPerform } from '@esliph/module'
import { AuthClientAuthorizationUseCase } from '@modules/auth/client/use-case/authorization.use-case'

@Filter({ name: 'user.filter.authorization' })
export class ClientAuthorizationFilter implements FilterPerform {
    constructor(@Injection.Inject('auth.client.use-case.authorization') private authorizationUC: AuthClientAuthorizationUseCase) { }

    async perform(req: Request<any>, res: Response<any>) {
        const { authorization } = req.headers

        const result = this.authorizationUC.perform({ Authorization: authorization })

        req.headers['userId'] = result.getValue().sub
    }
}
