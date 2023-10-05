import { Module } from '../common/module'
import { AccountModule } from './modules/account/account.module'
import { AuthenticationModule } from './modules/authentication/authentication.module'

export class AppModule extends Module {
    constructor() {
        super({ imports: [AccountModule, AuthenticationModule] })
    }
}