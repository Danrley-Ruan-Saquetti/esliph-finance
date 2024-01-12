import { Request } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Controller, Guard } from '@esliph/module'
import { Post } from '@services/http.service'
import { AuthBankAccountSignInUseCase } from '@modules/auth/bank-account/use-case/sign-in.use-case'

@Controller({ prefix: '/auth/bank-account' })
export class AuthBankAccountController {
    constructor(
        @Injection.Inject('auth.bank-account.use-case.sign-in') private signBankAccountInUC: AuthBankAccountSignInUseCase,
    ) { }

    @Guard({ name: 'customer.authorization' })
    @Post('/sign-in')
    async bankAccountSignIn(req: Request) {
        const { userId } = req.headers

        const result = await this.signBankAccountInUC.perform({ ...req.body, userId })

        return result
    }
}
