import { Module } from '@esliph/module'
import { AuthController } from '@modules/auth/auth.controller'
import { AuthCustomerModule } from '@modules/auth/customer/auth-customer.module'
import { AuthBankAccountModule } from '@modules/auth/bank-account/auth-bank-account.module'

@Module({
    imports: [AuthCustomerModule, AuthBankAccountModule],
    controllers: [AuthController],
})
export class AuthModule { }
