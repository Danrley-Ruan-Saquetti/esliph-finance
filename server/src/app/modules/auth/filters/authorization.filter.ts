import { Request, Response } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Filter, FilterPerform } from '@esliph/module'
import { AuthAuthorizationUseCase } from '../use-case/authorization.use-case'

@Filter({ name: 'authorization' })
export class AuthorizationFilter implements FilterPerform {
    constructor(@Injection.Inject('auth.use-case.authorization') private authorizationUC: AuthAuthorizationUseCase) {}

    async perform(req: Request<any>, res: Response<any>) {
        const { Authorization } = req.headers

        const result = this.authorizationUC.perform({ Authorization })

        req.headers['userId'] = result.getValue().sub
    }
}
