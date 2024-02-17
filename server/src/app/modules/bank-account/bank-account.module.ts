import { Module } from '@core'
import { BankAccountAdminController } from '@modules/bank-account/bank-account.admin.controller'
import { BankAccountCustomerController } from '@modules/bank-account/bank-account.customer.controller'
import { BankAccountUseCaseModule } from '@modules/bank-account/use-case/use-case.module'
import { BankAccountRepository } from '@modules/bank-account/bank-account.repository'
import { BankAccountBelongControl } from '@modules/bank-account/control/belong.control'
import { BalanceBankAccountControl } from '@modules/bank-account/control/balance-bank-account.control'

@Module({
    imports: [BankAccountUseCaseModule],
    controllers: [BankAccountCustomerController, BankAccountAdminController],
    providers: [BankAccountRepository, BankAccountBelongControl, BalanceBankAccountControl],
})
export class BankAccountModule { }
