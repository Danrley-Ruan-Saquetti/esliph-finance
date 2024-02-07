import { HttpStatusCodes, Request, Injection, Controller, Domain, Get } from '@core'
import { Post, HttpStatusCode } from '@services/http.service'
import { AuthCustomerSignUpUseCase } from '@modules/auth/customer/use-case/sign-up.use-case'
import { AuthCustomerSignInUseCase } from '@modules/auth/customer/use-case/sign-in.use-case'
import { AuthCustomerForgetPasswordUseCase } from '@modules/auth/customer/use-case/forget-password.use-case'

@Controller({ prefix: '/auth/customer', domain: Domain.CLIENT })
export class AuthCustomerController {
    constructor(
        @Injection.Inject('auth.customer.use-case.sign-up') private signUpUC: AuthCustomerSignUpUseCase,
        @Injection.Inject('auth.customer.use-case.sign-in') private signInUC: AuthCustomerSignInUseCase,
        @Injection.Inject('auth.customer.use-case.forget-password') private forgetPasswordUC: AuthCustomerForgetPasswordUseCase,
    ) { }

    @Post('/sign-up')
    @HttpStatusCode(HttpStatusCodes.CREATED)
    async signUp(req: Request) {
        const result = await this.signUpUC.perform(req.body)

        return result
    }

    @Post('/sign-in')
    async signIn(req: Request) {
        const result = await this.signInUC.perform(req.body)

        return result
    }

    @Post('/forget-password')
    async forgetPassword(req: Request) {
        const result = await this.forgetPasswordUC.perform(req.body)

        return result
    }

    @Post('/reset-password/:token')
    async resetPassword(req: Request) {
        return { ok: true }
    }
}
