import { Module } from '../../../common/module'
import { AccountController } from './account.controller'
import { AccountRepository } from './account.repository'
import { AccountService } from './account.service'
import { AccountRepositoryModule } from './repository/repository.module'
import { AccountUseCaseModule } from './use-case/use-case-module'

export class AccountModule extends Module {
    constructor() {
        super({
            imports: [AccountRepositoryModule, AccountUseCaseModule],
            controllers: [AccountController, AccountRepository],
            services: [AccountService],
        })
    }
}
