import { Module } from '../../../../common/module'
import { AccountCreateRepository } from './create'
import { AccountQueryRepository } from './query'
import { AccountUpdateRepository } from './update'

export class AccountRepositoryModule extends Module {
    constructor() {
        super({ services: [AccountCreateRepository, AccountQueryRepository, AccountUpdateRepository] })
    }
}
