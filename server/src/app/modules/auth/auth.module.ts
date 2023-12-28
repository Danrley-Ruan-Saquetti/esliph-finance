import { Module } from '@esliph/module'
import { AuthController } from '@modules/auth/auth.controller'
import { AuthUseCaseModule } from '@modules/auth/use-case/use-case.module'
import { UserAuthorizationFilter } from '@modules/auth/filters/user.authorization.filter'
import { BankAccountAuthorizationFilter } from '@modules/auth/filters/bank-account.authorization.filter'
import { UserExistsFilter } from '@modules/auth/filters/user.exists.filter'

@Module({
    imports: [AuthUseCaseModule],
    controllers: [AuthController],
    providers: [
        UserAuthorizationFilter,
        BankAccountAuthorizationFilter,
        UserExistsFilter,
        { use: 'user.filter.exists', whenCall: 'user.exists' },
        { use: 'bank-account.filter.authorization', whenCall: 'bank-account.authorization' },
        { use: 'user.filter.authorization', whenCall: 'user.authorization' },
    ],
})
export class AuthModule { }
