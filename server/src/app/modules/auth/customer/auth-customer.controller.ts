import { Request } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Controller } from '@esliph/module'
import { Post } from '@services/http.service'
import { AuthCustomerSignUpUseCase } from '@modules/auth/customer/use-case/sign-up.use-case'
import { AuthCustomerSignInUseCase } from '@modules/auth/customer/use-case/sign-in.use-case'

@Controller({ prefix: '/auth/customer' })
export class AuthCustomerController {
    constructor(
        @Injection.Inject('auth.customer.use-case.sign-up') private signUpUC: AuthCustomerSignUpUseCase,
        @Injection.Inject('auth.customer.use-case.sign-in') private signInUC: AuthCustomerSignInUseCase,
    ) { }

    @Post('/sign-up')
    async signUp(req: Request) {
        const result = await this.signUpUC.perform(req.body)

        return result
    }

    @Post('/sign-in')
    async signIn(req: Request) {
        const result = await this.signInUC.perform(req.body)

        return result
    }
}