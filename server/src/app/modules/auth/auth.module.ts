import { Module } from '@esliph/module'
import { AuthController } from '@modules/auth/auth.controller'
import { AuthUseCaseModule } from '@modules/auth/use-case/use-case.module'

@Module({
    imports: [AuthUseCaseModule],
    controllers: [AuthController],
    providers: [],
})
export class AuthModule {}
