import { Module } from '../common/module'
import { AccountModule } from './modules/account/account.module'

export class AppModule extends Module {
    constructor() {
        super({ imports: [AccountModule] })
    }
}