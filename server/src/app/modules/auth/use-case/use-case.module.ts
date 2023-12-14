import { Module } from '@esliph/module'
import { AuthSignInUseCase } from '@modules/auth/use-case/sign-in.user.use-case'
import { AuthUserAuthorizationUseCase } from '@modules/auth/use-case/user.authorization.use-case'
import { AuthBankAccountAuthorizationUseCase } from '@modules/auth/use-case/bank-account.authorization.use-case'
import { AuthSignUpUseCase } from '@modules/auth/use-case/sign-up.user.use-case'

@Module({
    providers: [AuthSignInUseCase, AuthSignUpUseCase, AuthUserAuthorizationUseCase, AuthBankAccountAuthorizationUseCase],
})
export class AuthUseCaseModule { }
