import { Request, Response } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Filter, FilterPerform } from '@esliph/module'
import { AuthUserAuthorizationUseCase } from '@modules/auth/use-case/user.authorization.use-case'

@Filter({ name: 'user.filter.authorization' })
export class UserAuthorizationFilter implements FilterPerform {
    constructor(@Injection.Inject('auth.user.use-case.authorization') private authorizationUC: AuthUserAuthorizationUseCase) { }

    async perform(req: Request<any>, res: Response<any>) {
        const { authorization } = req.headers

        console.log('user', authorization)

        const result = this.authorizationUC.perform({ Authorization: authorization })

        req.headers['userId'] = result.getValue().sub
    }
}
