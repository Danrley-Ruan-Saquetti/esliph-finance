import { Module } from '@core'
import { AuthCustomerSignInUseCase } from '@modules/auth/customer/use-case/sign-in.use-case'
import { AuthCustomerAuthorizationUseCase } from '@modules/auth/customer/use-case/authorization.use-case'
import { AuthCustomerSignUpUseCase } from '@modules/auth/customer/use-case/sign-up.use-case'

@Module({
    providers: [AuthCustomerSignInUseCase, AuthCustomerSignUpUseCase, AuthCustomerAuthorizationUseCase],
})
export class AuthCustomerUseCaseModule { }
