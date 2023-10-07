import { Module } from '../common/module'
import { AuthModule } from './modules/auth/auth.module'
import { AccountModule } from './modules/account/account.module'
import { CategoryModule } from './modules/category/category.module'

export class AppModule extends Module {
    constructor() {
        super({ imports: [AuthModule, AccountModule, CategoryModule] })
    }
}
