import { Module } from '@esliph/module'
import { PeopleModule } from '@modules/people/people.module'
import { UserModule } from '@modules/user/user.module'
import { BankAccountModule } from '@modules/bank-account/bank-account.module'
import { AuthModule } from '@modules/auth/auth.module'
import { CategoryModule } from '@modules/category/category.module'
import { PaymentModule } from '@modules/payment/payment.module'
import { FinancialTransactionModule } from '@modules/financial-transaction/financial-transaction.module'
import { NoteModule } from '@modules/note/note.module'

@Module({
    imports: [PeopleModule, UserModule, AuthModule, BankAccountModule, CategoryModule, FinancialTransactionModule, PaymentModule, NoteModule],
})
export class AppModule { }
