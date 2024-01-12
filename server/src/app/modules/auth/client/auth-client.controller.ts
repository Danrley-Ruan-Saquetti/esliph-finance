import { Request } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Controller } from '@esliph/module'
import { Post } from '@services/http.service'
import { AuthClientSignUpUseCase } from '@modules/auth/client/use-case/sign-up.use-case'
import { AuthClientSignInUseCase } from '@modules/auth/client/use-case/sign-in.use-case'

@Controller({ prefix: '/auth/client' })
export class AuthClientController {
    constructor(
        @Injection.Inject('auth.client.use-case.sign-up') private signUpUC: AuthClientSignUpUseCase,
        @Injection.Inject('auth.client.use-case.sign-in') private signInUC: AuthClientSignInUseCase,
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
