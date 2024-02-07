import { Module } from '@core'
import { AuthCustomerSignInUseCase } from '@modules/auth/customer/use-case/sign-in.use-case'
import { AuthCustomerAuthorizationUseCase } from '@modules/auth/customer/use-case/authorization.use-case'
import { AuthCustomerSignUpUseCase } from '@modules/auth/customer/use-case/sign-up.use-case'
import { AuthCustomerForgetPasswordUseCase } from '@modules/auth/customer/use-case/forget-password.use-case'

@Module({
    providers: [AuthCustomerSignInUseCase, AuthCustomerSignUpUseCase, AuthCustomerAuthorizationUseCase, AuthCustomerForgetPasswordUseCase],
})
export class AuthCustomerUseCaseModule { }
