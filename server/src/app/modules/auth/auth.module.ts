import { Module } from '@esliph/module'
import { AuthController } from '@modules/auth/auth.controller'
import { AuthUseCaseModule } from '@modules/auth/use-case/use-case.module'
import { UserAuthorizationFilter } from '@modules/auth/filters/user.authorization.filter'
import { BankAccountAuthorizationFilter } from '@modules/auth/filters/bank-account.authorization.filter'

@Module({
    imports: [AuthUseCaseModule],
    controllers: [AuthController],
    providers: [
        UserAuthorizationFilter,
        BankAccountAuthorizationFilter,
        { use: 'user.filter.authorization', whenCall: 'user.authorization' },
        { use: 'bank-account.filter.authorization', whenCall: 'bank-account.authorization' }
    ],
})
export class AuthModule { }
