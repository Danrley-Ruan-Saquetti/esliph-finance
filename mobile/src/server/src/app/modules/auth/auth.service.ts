import { Service } from '../../../common/service'
import { AuthAuthenticationUseCase, AuthAuthenticationArgs } from './use-case/authentication'
import { AuthLoginArgs, AuthLoginUseCase } from './use-case/login'

export class AuthService extends Service {
    private readonly authLoginUseCase: AuthLoginUseCase
    private readonly authAuthenticationUseCase: AuthAuthenticationUseCase

    constructor() {
        super()

        this.authLoginUseCase = new AuthLoginUseCase()
        this.authAuthenticationUseCase = new AuthAuthenticationUseCase()
    }

    initComponents() {}

    async login(args: AuthLoginArgs) {
        const response = await this.authLoginUseCase.perform(args)

        return response
    }

    async authentication(args: AuthAuthenticationArgs) {
        const response = await this.authAuthenticationUseCase.perform(args)

        return response
    }
}
