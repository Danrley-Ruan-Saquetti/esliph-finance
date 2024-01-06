import { Module } from '@esliph/module'
import { BankAccountUseCaseModule } from '@modules/bank-account/use-case/use-case.module'
import { BankAccountController } from '@modules/bank-account/bank-account.controller'
import { BankAccountRepository } from '@modules/bank-account/bank-account.repository'
import { BankAccountBelongControl } from '@modules/bank-account/control/belong.control'

@Module({
    imports: [BankAccountUseCaseModule],
    controllers: [BankAccountController],
    providers: [BankAccountRepository, BankAccountBelongControl],
})
export class BankAccountModule { }
