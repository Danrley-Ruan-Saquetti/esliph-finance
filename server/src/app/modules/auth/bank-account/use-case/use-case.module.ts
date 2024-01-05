import { Module } from '@esliph/module'
import { AuthBankAccountAuthorizationUseCase } from '@modules/auth/bank-account/use-case/authorization.use-case'
import { AuthBankAccountSignInUseCase } from '@modules/auth/bank-account/use-case/sign-in.use-case'

@Module({
    providers: [AuthBankAccountSignInUseCase, AuthBankAccountAuthorizationUseCase],
})
export class AuthBankAccountUseCaseModule { }
