import { Module } from '@esliph/module'
import { AuthClientController } from '@modules/auth/client/auth-client.controller'
import { ClientAuthorizationFilter } from '@modules/auth/client/filters/authorization.filter'
import { AuthClientUseCaseModule } from '@modules/auth/client/use-case/use-case.module'

@Module({
    imports: [AuthClientUseCaseModule],
    controllers: [AuthClientController],
    providers: [
        ClientAuthorizationFilter,
        { use: 'client.filter.authorization', whenCall: 'client.authorization' },
    ],
})
export class AuthClientModule { }
