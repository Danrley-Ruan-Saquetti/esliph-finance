import { Request, Injection, Controller } from '@core'
import { Post } from '@services/http.service'
import { AuthAdminSignInUseCase } from '@modules/auth/admin/use-case/sign-in.use-case'

@Controller({ prefix: '/auth/admin' })
export class AuthAdminController {
    constructor(
        @Injection.Inject('auth.admin.use-case.sign-in') private signInUC: AuthAdminSignInUseCase,
    ) { }

    @Post('/sign-in')
    async signIn(req: Request) {
        const result = await this.signInUC.perform(req.body)

        return result
    }
}
