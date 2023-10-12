import { Module } from '../../../common/module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthorizationGuard } from './guards/authorization.guard'
import { AuthUseCaseModule } from './use-case/use-case.module'

export class AuthModule extends Module {
    constructor() {
        super({
            imports: [AuthUseCaseModule],
            controllers: [AuthController],
            services: [AuthService, AuthorizationGuard]
        })
    }
}
