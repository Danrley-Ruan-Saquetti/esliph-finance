import { Inversion } from '../../../core/injection'
import { Service } from '../../../common/service'
import { AuthAuthorizationUseCase, AuthAuthorizationArgs } from './use-case/authorization'
import { AuthLoginArgs, AuthLoginUseCase } from './use-case/login'

@Inversion.Injectable('AuthService')
export class AuthService extends Service {
    constructor(
        @Inversion.Inject('AuthLoginUseCase') private readonly authLoginUseCase: AuthLoginUseCase,
        @Inversion.Inject('AuthAuthorizationUseCase') private readonly authAuthorizationUseCase: AuthAuthorizationUseCase
    ) {
        super()
    }

    async login(args: AuthLoginArgs) {
        const response = await this.authLoginUseCase.perform(args)

        return response
    }

    async authorization(args: AuthAuthorizationArgs) {
        const response = await this.authAuthorizationUseCase.perform(args)

        return response
    }
}
