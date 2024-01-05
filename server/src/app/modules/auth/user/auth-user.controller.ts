import { Request } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Controller } from '@esliph/module'
import { Post } from '@services/http.service'
import { AuthUserSignUpUseCase } from '@modules/auth/user/use-case/sign-up.use-case'
import { AuthUserSignInUseCase } from '@modules/auth/user/use-case/sign-in.use-case'

@Controller({ prefix: '/auth/user' })
export class AuthUserController {
    constructor(
        @Injection.Inject('auth.user.use-case.sign-up') private signUpUC: AuthUserSignUpUseCase,
        @Injection.Inject('auth.user.use-case.sign-in') private signInUC: AuthUserSignInUseCase,
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
