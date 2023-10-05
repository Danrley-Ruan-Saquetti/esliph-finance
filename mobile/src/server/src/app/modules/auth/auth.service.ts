import { Service } from '../../../common/service'
import { AuthAuthorizationUseCase, AuthAuthorizationArgs } from './use-case/authorization'
import { AuthLoginArgs, AuthLoginUseCase } from './use-case/login'

export class AuthService extends Service {
    private readonly authLoginUseCase: AuthLoginUseCase
    private readonly authAuthorizationUseCase: AuthAuthorizationUseCase

    constructor() {
        super()

        this.authLoginUseCase = new AuthLoginUseCase()
        this.authAuthorizationUseCase = new AuthAuthorizationUseCase()
    }

    initComponents() {}

    async login(args: AuthLoginArgs) {
        const response = await this.authLoginUseCase.perform(args)

        return response
    }

    async authorization(args: AuthAuthorizationArgs) {
        const response = await this.authAuthorizationUseCase.perform(args)

        return response
    }
}
