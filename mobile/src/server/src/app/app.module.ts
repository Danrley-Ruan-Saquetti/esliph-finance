import { Module } from '../common/module'
import { AccountController } from './modules/account/account.controller'

export class AppModule extends Module {
    constructor() {
        super({ controllers: [AccountController] })
    }
}