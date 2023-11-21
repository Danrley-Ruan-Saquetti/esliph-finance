import { Module } from '@esliph/module'
import { AccountCreateUseCase } from '@modules/account/use-case/create.use-case'

@Module({
    providers: [AccountCreateUseCase],
})
export class AccountUseCaseModule {}
