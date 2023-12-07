import { Module } from '@esliph/module'
import { AuthSignInUseCase } from '@modules/auth/use-case/sign-in.use-case'
import { AuthAuthorizationUseCase } from '@modules/auth/use-case/authorization.use-case'
import { AuthSignUpUseCase } from '@modules/auth/use-case/sign-up.use-case'

@Module({
    providers: [AuthSignInUseCase, AuthSignUpUseCase, AuthAuthorizationUseCase],
})
export class AuthUseCaseModule {}