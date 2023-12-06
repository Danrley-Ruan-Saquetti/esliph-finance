import { Module } from '@esliph/module'
import { UserModule } from '@modules/user/user.module'
import { BankAccountModule } from '@modules/bank-account/bank-account.module'
import { AuthModule } from '@modules/auth/auth.module'

@Module({
    imports: [UserModule, AuthModule, BankAccountModule],
})
export class AppModule { }
