import { Module } from '@esliph/module'
import { AuthUserSignInUseCase } from '@modules/auth/use-case/sign-in.user.use-case'
import { AuthUserAuthorizationUseCase } from '@modules/auth/use-case/user.authorization.use-case'
import { AuthBankAccountAuthorizationUseCase } from '@modules/auth/use-case/bank-account.authorization.use-case'
import { AuthUserSignUpUseCase } from '@modules/auth/use-case/sign-up.user.use-case'
import { AuthBankAccountSignInUseCase } from '@modules/auth/use-case/sign-in.bank-account.use-case'

@Module({
    providers: [AuthUserSignInUseCase, AuthUserSignUpUseCase, AuthUserAuthorizationUseCase, AuthBankAccountSignInUseCase, AuthBankAccountAuthorizationUseCase],
})
export class AuthUseCaseModule {}
