import { Service } from '../../../common/service'
import { AuthenticationLoginArgs, AuthenticationLoginUseCase } from './use-case/login'

export class AuthenticationService extends Service {
    private readonly authenticationLoginUseCase: AuthenticationLoginUseCase

    constructor() {
        super()

        this.authenticationLoginUseCase = new AuthenticationLoginUseCase()
    }

    initComponents() { }

    async login(args: AuthenticationLoginArgs) {
        const response = await this.authenticationLoginUseCase.perform(args)

        return response
    }
}
