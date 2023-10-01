import { Controller } from '../common/controller'
import { AccountController } from './modules/account/account.controller'

export class AppModule {
    private controllers: (new () => Controller)[]

    constructor() {
        this.controllers = [AccountController]
    }

    public getController() {
        return this.controllers
    }
}