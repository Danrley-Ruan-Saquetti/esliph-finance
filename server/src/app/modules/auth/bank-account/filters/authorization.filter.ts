import { Request, Response, Injection, Filter, FilterPerform } from '@core'
import { AuthBankAccountAuthorizationUseCase } from '@modules/auth/bank-account/use-case/authorization.use-case'

@Filter({ name: 'bank-account.filter.authorization' })
export class BankAccountAuthorizationFilter implements FilterPerform {
    constructor(@Injection.Inject('auth.bank-account.use-case.authorization') private authorizationUC: AuthBankAccountAuthorizationUseCase) { }

    async perform(req: Request<any>, res: Response<any>) {
        const AuthorizationBankAccount = req.headers['authorizationbankaccount'] || req.headers['authorizationBankAccount'] || req.headers['AuthorizationBankAccount'] || req.headers['authorization'] || req.headers['Authorization']

        const result = this.authorizationUC.perform({ AuthorizationBankAccount })

        req.headers['userId'] = result.getValue().sub
        req.headers['peopleId'] = result.getValue().peopleId
        req.headers['bankAccountId'] = result.getValue().bankAccount
    }
}
