import { Request, Response } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Filter, FilterPerform } from '@esliph/module'
import { AuthCustomerAuthorizationUseCase } from '@modules/auth/customer/use-case/authorization.use-case'

@Filter({ name: 'customer.filter.authorization' })
export class CustomerAuthorizationFilter implements FilterPerform {
    constructor(@Injection.Inject('auth.customer.use-case.authorization') private authorizationUC: AuthCustomerAuthorizationUseCase) { }

    async perform(req: Request<any>, res: Response<any>) {
        const { authorization } = req.headers

        const result = this.authorizationUC.perform({ Authorization: authorization })

        req.headers['userId'] = result.getValue().sub
        req.headers['peopleId'] = result.getValue().peopleId
    }
}
