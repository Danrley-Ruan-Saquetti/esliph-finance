import { Module } from '@esliph/module'
import { AccountCreateUseCase } from '@modules/account/use-case/create.use-case'
import { AccountQueryUseCase } from '@modules/account/use-case/query.use-case'

@Module({
    providers: [AccountCreateUseCase, AccountQueryUseCase],
})
export class AccountUseCaseModule { }
