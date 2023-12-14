import { Request, Response } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Controller } from '@esliph/module'
import { Post } from '@esliph/adapter-fastify'
import { AuthSignUpUseCase } from '@modules/auth/use-case/sign-up.use-case'
import { AuthSignInUseCase } from '@modules/auth/use-case/sign-in.use-case'

@Controller()
export class AuthController {
    constructor(
        @Injection.Inject('auth.user.use-case.sign-up') private signUpUC: AuthSignUpUseCase,
        @Injection.Inject('auth.user.use-case.sign-in') private signInUC: AuthSignInUseCase,
    ) { }

    @Post('/auth/user/sign-up')
    async userSignUp(req: Request) {
        const result = await this.signUpUC.perform(req.body)

        return result
    }

    @Post('/auth/user/sign-in')
    async userSignIn(req: Request) {
        const result = await this.signInUC.perform(req.body)

        return result
    }

    @Post('/auth/bank-account/sign-in')
    async bankAccountSignIn(req: Request) {
        const result = await this.signInUC.perform(req.body)

        return result
    }
}
