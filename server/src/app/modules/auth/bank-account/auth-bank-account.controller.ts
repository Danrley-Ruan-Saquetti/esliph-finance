import { Request, Injection, Controller, Guard, Domain } from '@core'
import { Post } from '@services/http.service'
import { AuthBankAccountSignInUseCase } from '@modules/auth/bank-account/use-case/sign-in.use-case'

@Controller({ prefix: '/auth/bank-account', domain: Domain.CUSTOMER })
export class AuthBankAccountController {
    constructor(
        @Injection.Inject('auth.bank-account.use-case.sign-in') private signBankAccountInUC: AuthBankAccountSignInUseCase,
    ) { }

    @Guard({ name: 'customer.authorization' })
    @Post('/sign-in')
    async bankAccountSignIn(req: Request) {
        const { peopleId } = req.headers

        const result = await this.signBankAccountInUC.perform({ ...req.body, peopleId })

        return result
    }
}
