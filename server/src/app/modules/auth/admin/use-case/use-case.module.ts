import { Module } from '@core'
import { AuthAdminSignInUseCase } from '@modules/auth/admin/use-case/sign-in.use-case'
import { AuthAdminAuthorizationUseCase } from '@modules/auth/admin/use-case/authorization.use-case'

@Module({
    providers: [AuthAdminSignInUseCase, AuthAdminAuthorizationUseCase],
})
export class AuthAdminUseCaseModule { }
