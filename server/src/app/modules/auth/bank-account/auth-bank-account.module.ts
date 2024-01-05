import { Module } from '@esliph/module'
import { BankAccountAuthorizationFilter } from '@modules/auth/bank-account/filters/authorization.filter'
import { AuthBankAccountUseCaseModule } from '@modules/auth/bank-account/use-case/use-case.module'
import { AuthBankAccountController } from '@modules/auth/bank-account/auth-bank-account.controller'

@Module({
    imports: [AuthBankAccountUseCaseModule],
    controllers: [AuthBankAccountController],
    providers: [
        BankAccountAuthorizationFilter,
        { use: 'bank-account.filter.authorization', whenCall: 'bank-account.authorization' },
    ],
})
export class AuthBankAccountModule { }
