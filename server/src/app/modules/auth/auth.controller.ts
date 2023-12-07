import { Request, Response } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Controller } from '@esliph/module'
import { Post } from '@esliph/adapter-fastify'
import { AuthSignUpUseCase } from '@modules/auth/use-case/sign-up.use-case'
import { AuthSignInUseCase } from '@modules/auth/use-case/sign-in.use-case'

@Controller()
export class AuthController {
    constructor(
        @Injection.Inject('auth.use-case.sign-up') private signUpUC: AuthSignUpUseCase,
        @Injection.Inject('auth.use-case.sign-in') private signInUC: AuthSignInUseCase,
    ) {}

    @Post('/auth/sign-up')
    async signUp(req: Request) {
        const result = await this.signUpUC.perform(req.body)

        return result
    }

    @Post('/auth/sign-in')
    async signIn(req: Request) {
        const result = await this.signInUC.perform(req.body)

        return result
    }
}
