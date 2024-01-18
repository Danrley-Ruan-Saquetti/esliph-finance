import { Module } from '@core'
import { AuthController } from '@modules/auth/auth.controller'
import { AuthAdminModule } from '@modules/auth/admin/auth-admin.module'
import { AuthCustomerModule } from '@modules/auth/customer/auth-customer.module'
import { AuthBankAccountModule } from '@modules/auth/bank-account/auth-bank-account.module'

@Module({
    imports: [AuthAdminModule, AuthCustomerModule, AuthBankAccountModule],
    controllers: [AuthController],
})
export class AuthModule { }
