import { Module } from '@esliph/module'
import { AuthUserController } from '@modules/auth/user/auth-user.controller'
import { UserAuthorizationFilter } from '@modules/auth/user/filters/authorization.filter'
import { AuthUserUseCaseModule } from '@modules/auth/user/use-case/use-case.module'
import { UserExistsFilter } from '@modules/auth/user/filters/exists.filter'

@Module({
    imports: [AuthUserUseCaseModule],
    controllers: [AuthUserController],
    providers: [
        UserAuthorizationFilter,
        UserExistsFilter,
        { use: 'user.filter.exists', whenCall: 'user.exists' },
        { use: 'user.filter.authorization', whenCall: 'user.authorization' },
    ],
})
export class AuthUserModule { }
