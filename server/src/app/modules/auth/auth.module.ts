import { Module } from '@esliph/module'
import { AuthController } from '@modules/auth/auth.controller'
import { AuthClientModule } from '@modules/auth/client/auth-client.module'
import { AuthBankAccountModule } from '@modules/auth/bank-account/auth-bank-account.module'

@Module({
    imports: [AuthClientModule, AuthBankAccountModule],
    controllers: [AuthController],
})
export class AuthModule { }
