import { Request, Response, Injection, Filter, FilterPerform } from '@core'
import { AuthAdminAuthorizationUseCase } from '@modules/auth/admin/use-case/authorization.use-case'

@Filter({ name: 'admin.filter.authorization' })
export class AdminAuthorizationFilter implements FilterPerform {
    constructor(@Injection.Inject('auth.admin.use-case.authorization') private authorizationUC: AuthAdminAuthorizationUseCase) { }

    async perform(req: Request<any>, res: Response<any>) {
        const { authorization } = req.headers

        const result = this.authorizationUC.perform({ Authorization: authorization })

        req.headers['userId'] = result.getValue().sub
        req.headers['peopleId'] = result.getValue().peopleId
    }
}
