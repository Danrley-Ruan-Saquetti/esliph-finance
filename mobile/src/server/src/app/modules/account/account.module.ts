import { Module } from '../../../common/module'
import { AccountController } from './account.controller'
import { AccountRepository } from './account.repository'
import { AccountService } from './account.service'

export class AccountModule extends Module {
    constructor() {
        super({ imports: [], controllers: [AccountController, AccountRepository], services: [AccountService] })
    }
}
