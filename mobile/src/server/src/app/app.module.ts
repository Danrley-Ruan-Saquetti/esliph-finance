import { Module } from '../common/module'
import { AccountModule } from './modules/account/account.module'
import { AuthModule } from './modules/auth/auth.module'

export class AppModule extends Module {
    constructor() {
        super({ imports: [AccountModule, AuthModule] })
    }
}
