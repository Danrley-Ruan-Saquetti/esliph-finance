import { Request, Response } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Filter, FilterPerform } from '@esliph/module'
import { AuthBankAccountAuthorizationUseCase } from '@modules/auth/bank-account/use-case/authorization.use-case'

@Filter({ name: 'bank-account.filter.authorization' })
export class BankAccountAuthorizationFilter implements FilterPerform {
    constructor(@Injection.Inject('auth.bank-account.use-case.authorization') private authorizationUC: AuthBankAccountAuthorizationUseCase) { }

    async perform(req: Request<any>, res: Response<any>) {
        const AuthorizationBankAccount = req.headers['authorizationbankaccount'] || req.headers['authorization']

        const result = this.authorizationUC.perform({ AuthorizationBankAccount })

        req.headers['userId'] = result.getValue().sub
        req.headers['bankAccountId'] = result.getValue().bankAccount
    }
}
