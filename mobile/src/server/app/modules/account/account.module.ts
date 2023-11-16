import { Module } from '@esliph/module'
import { AccountUseCaseModule } from '@modules/account/use-case/use-case.module'
import { AccountController } from '@modules/account/account.controller'

@Module({
    imports: [AccountUseCaseModule],
    controllers: [AccountController]
})
export class AccountModule {}
