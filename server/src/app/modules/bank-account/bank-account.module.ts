import { Module } from '@core'
import { BankAccountAdminController } from '@modules/bank-account/bank-account.admin.controller'
import { BankAccountClientController } from '@modules/bank-account/bank-account.client.controller'
import { BankAccountUseCaseModule } from '@modules/bank-account/use-case/use-case.module'
import { BankAccountRepository } from '@modules/bank-account/bank-account.repository'
import { BankAccountBelongControl } from '@modules/bank-account/control/belong.control'
import { BalanceBankAccountControl } from '@modules/bank-account/control/balance-bank-account.control'

@Module({
    imports: [BankAccountUseCaseModule],
    controllers: [BankAccountClientController, BankAccountAdminController],
    providers: [BankAccountRepository, BankAccountBelongControl, BalanceBankAccountControl],
})
export class BankAccountModule { }
