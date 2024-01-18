import { Module } from '@core'
import { AuthAdminController } from '@modules/auth/admin/auth-admin.controller'
import { AdminAuthorizationFilter } from '@modules/auth/admin/filters/authorization.filter'
import { AuthAdminUseCaseModule } from '@modules/auth/admin/use-case/use-case.module'

@Module({
    imports: [AuthAdminUseCaseModule],
    controllers: [AuthAdminController],
    providers: [
        AdminAuthorizationFilter,
        { use: 'admin.filter.authorization', whenCall: 'admin.authorization' },
    ],
})
export class AuthAdminModule { }
