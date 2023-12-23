import { Request, Response } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Controller, Guard } from '@esliph/module'
import { Post } from '@services/http.service'
import { AuthUserSignUpUseCase } from '@modules/auth/use-case/sign-up.user.use-case'
import { AuthUserSignInUseCase } from '@modules/auth/use-case/sign-in.user.use-case'
import { AuthBankAccountSignInUseCase } from '@modules/auth/use-case/sign-in.bank-account.use-case'

@Controller()
export class AuthController {
    constructor(
        @Injection.Inject('auth.user.use-case.sign-up') private signUserUpUC: AuthUserSignUpUseCase,
        @Injection.Inject('auth.user.use-case.sign-in') private signUserInUC: AuthUserSignInUseCase,
        @Injection.Inject('auth.bank-account.use-case.sign-in') private signBankAccountInUC: AuthBankAccountSignInUseCase,
    ) { }

    @Post('/auth/user/sign-up')
    async userSignUp(req: Request) {
        const result = await this.signUserUpUC.perform(req.body)

        return result
    }

    @Post('/auth/user/sign-in')
    async userSignIn(req: Request) {
        const result = await this.signUserInUC.perform(req.body)

        return result
    }

    @Guard({ name: 'user.authorization' })
    @Post('/auth/bank-account/sign-in')
    async bankAccountSignIn(req: Request) {
        const { userId } = req.headers

        const result = await this.signBankAccountInUC.perform({ ...req.body, userId })

        return result
    }
}
