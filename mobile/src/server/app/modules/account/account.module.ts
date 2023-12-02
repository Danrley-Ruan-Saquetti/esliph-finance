import { Module } from '@esliph/module'
import { AccountUseCaseModule } from '@modules/account/use-case/use-case.module'
import { AccountController } from '@modules/account/account.controller'
import { AccountRepository } from '@modules/account/account.repository'

@Module({
    imports: [AccountUseCaseModule],
    controllers: [AccountController],
    providers: [AccountRepository]
})
export class AccountModule { }
