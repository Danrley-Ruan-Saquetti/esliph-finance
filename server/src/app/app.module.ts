import { Module } from '@esliph/module'
import { UserModule } from '@modules/user/user.module'
import { BankAccountModule } from '@modules/bank-account/bank-account.module'

@Module({
    imports: [UserModule, BankAccountModule],
})
export class AppModule {}
