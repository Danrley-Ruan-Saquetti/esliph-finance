import { Module } from '@esliph/module'
import { UserModule } from '@modules/user/user.module'
import { BankAccountModule } from '@modules/bank-account/bank-account.module'
import { AuthModule } from '@modules/auth/auth.module'
import { CategoryModule } from '@modules/category/category.module'
import { FinancialTransactionModule } from '@modules/financial-transaction/financial-transaction.module'

@Module({
    imports: [UserModule, AuthModule, BankAccountModule, CategoryModule, FinancialTransactionModule],
})
export class AppModule {}
