import { Service } from '../../../common/service'
import { AuthLoginArgs, AuthLoginUseCase } from './use-case/login'

export class AuthService extends Service {
    private readonly AuthLoginUseCase: AuthLoginUseCase

    constructor() {
        super()

        this.AuthLoginUseCase = new AuthLoginUseCase()
    }

    initComponents() {}

    async login(args: AuthLoginArgs) {
        const response = await this.AuthLoginUseCase.perform(args)

        return response
    }
}
