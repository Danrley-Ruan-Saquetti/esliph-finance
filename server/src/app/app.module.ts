import { Module } from '@core'
import { PeopleModule } from '@modules/people/people.module'
import { UserModule } from '@modules/user/user.module'
import { BankAccountModule } from '@modules/bank-account/bank-account.module'
import { AuthModule } from '@modules/auth/auth.module'
import { CategoryModule } from '@modules/category/category.module'
import { PaymentModule } from '@modules/payment/payment.module'
import { FinancialTransactionModule } from '@modules/financial-transaction/financial-transaction.module'
import { NoteModule } from '@modules/note/note.module'
import { NotificationModule } from '@modules/notification/notification.module'
import { AddressModule } from '@modules/address/address.module'
import { PlaceModule } from '@modules/place/place.module'

@Module({
    imports: [
        PeopleModule,
        UserModule,
        AuthModule,
        BankAccountModule,
        CategoryModule,
        FinancialTransactionModule,
        PaymentModule,
        NoteModule,
        NotificationModule,
        AddressModule,
        PlaceModule,
    ],
})
export class AppModule { }
