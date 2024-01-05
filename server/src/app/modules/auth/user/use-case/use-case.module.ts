import { Module } from '@esliph/module'
import { AuthUserSignInUseCase } from '@modules/auth/user/use-case/sign-in.use-case'
import { AuthUserAuthorizationUseCase } from '@modules/auth/user/use-case/authorization.use-case'
import { AuthUserSignUpUseCase } from '@modules/auth/user/use-case/sign-up.use-case'
import { AuthUserExistsUseCase } from '@modules/auth/user/use-case/exists.use-case'

@Module({
    providers: [AuthUserSignInUseCase, AuthUserSignUpUseCase, AuthUserAuthorizationUseCase, AuthUserExistsUseCase],
})
export class AuthUserUseCaseModule { }
