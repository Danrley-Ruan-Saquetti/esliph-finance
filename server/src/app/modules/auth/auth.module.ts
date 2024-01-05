import { Module } from '@esliph/module'
import { AuthController } from '@modules/auth/auth.controller'
import { AuthUserModule } from '@modules/auth/user/auth-user.module'

@Module({
    imports: [AuthUserModule],
    controllers: [AuthController],
})
export class AuthModule { }
