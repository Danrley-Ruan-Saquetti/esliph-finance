import { Result, Injection, Service } from '@core'
import { UseCase } from '@common/use-case'
import { AuthCustomerAuthorizationUseCase } from '@modules/auth/customer/use-case/authorization.use-case'

export type AuthCustomerValidAuthorizationDTOArgs = { token: string }

@Service({ name: 'auth.customer.use-case.valid-authorization' })
export class AuthCustomerValidAuthorizationUseCase extends UseCase {
    constructor(
        @Injection.Inject('auth.customer.use-case.authorization') private authorizationUC: AuthCustomerAuthorizationUseCase,
    ) {
        super()
    }

    perform({ token }: AuthCustomerValidAuthorizationDTOArgs) {
        const result = this.authorizationUC.perform({ Authorization: `Bearer ${token}` })

        return Result.success({ message: 'This token is valid' })
    }
}
