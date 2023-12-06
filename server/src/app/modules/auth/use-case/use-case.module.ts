import { Module } from '@esliph/module'
import { AuthSignInUseCase } from '@modules/auth/use-case/sign-in.use-case'
import { AuthAuthorizationUseCase } from '@modules/auth/use-case/authorization.use-case'

@Module({
    providers: [AuthSignInUseCase, AuthAuthorizationUseCase],
})
export class AuthUseCaseModule { }
