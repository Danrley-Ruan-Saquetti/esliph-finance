import { Module } from '@core'
import { BankAccountUseCaseModule } from '@modules/bank-account/use-case/use-case.module'
import { BankAccountController } from '@modules/bank-account/bank-account.controller'
import { BankAccountRepository } from '@modules/bank-account/bank-account.repository'
import { BankAccountBelongControl } from '@modules/bank-account/control/belong.control'
import { BalanceBankAccountControl } from '@modules/bank-account/control/balance-bank-account.control'

@Module({
    imports: [BankAccountUseCaseModule],
    controllers: [BankAccountController],
    providers: [BankAccountRepository, BankAccountBelongControl, BalanceBankAccountControl],
})
export class BankAccountModule { }
