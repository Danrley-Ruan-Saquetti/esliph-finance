import { Module } from '@esliph/module'
import { UserModule } from '@modules/user/user.module'
import { BankAccountModule } from '@modules/bank-account/bank-account.module'
import { AuthModule } from '@modules/auth/auth.module'
import { CategoryModule } from '@modules/category/category.module'

@Module({
    imports: [UserModule, AuthModule, BankAccountModule, CategoryModule],
})
export class AppModule { }
