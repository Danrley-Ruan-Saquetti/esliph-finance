import { Module } from '@esliph/module'
import { AuthController } from '@modules/auth/auth.controller'
import { AuthUseCaseModule } from '@modules/auth/use-case/use-case.module'
import { AuthorizationFilter } from '@modules/auth/filters/authorization.filter'

@Module({
    imports: [AuthUseCaseModule],
    controllers: [AuthController],
    providers: [AuthorizationFilter],
})
export class AuthModule {}
