import { Module } from '@esliph/module'
import { AuthController } from '@modules/auth/auth.controller'
import { AuthUserModule } from '@modules/auth/user/auth-user.module'
import { AuthBankAccountModule } from '@modules/auth/bank-account/auth-bank-account.module'

@Module({
    imports: [AuthUserModule, AuthBankAccountModule],
    controllers: [AuthController],
})
export class AuthModule { }
