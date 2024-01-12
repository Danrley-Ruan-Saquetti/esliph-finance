import { Module } from '@esliph/module'
import { AuthClientSignInUseCase } from '@modules/auth/client/use-case/sign-in.use-case'
import { AuthClientAuthorizationUseCase } from '@modules/auth/client/use-case/authorization.use-case'
import { AuthClientSignUpUseCase } from '@modules/auth/client/use-case/sign-up.use-case'

@Module({
    providers: [AuthClientSignInUseCase, AuthClientSignUpUseCase, AuthClientAuthorizationUseCase],
})
export class AuthClientUseCaseModule { }
