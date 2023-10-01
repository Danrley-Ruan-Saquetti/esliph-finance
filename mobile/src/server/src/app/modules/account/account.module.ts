import { Module } from '../../../common/module'
import { AccountController } from './account.controller'
import { AccountRepository } from './account.repository'

export class AccountModule extends Module {
    constructor() {
        super({ imports: [], controllers: [AccountController, AccountRepository], services: [] })
    }
}