import { Module } from '../../../../common/module'
import { AccountCreateUseCase } from './create'
import { AccountFindFirstUseCase } from './query/find-first'
import { AccountFindManyUseCase } from './query/find-many'
import { AccountUpdateUseCase } from './update'

export class AccountUseCaseModule extends Module {
    constructor() {
        super({ services: [AccountCreateUseCase, AccountFindFirstUseCase, AccountFindManyUseCase, AccountUpdateUseCase] })
    }
}
