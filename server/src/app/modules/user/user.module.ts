import { Module } from '@esliph/module'
import { UserController } from '@modules/user/user.controller'
import { UserRepository } from '@modules/user/user.repository'
import { UserUseCaseModule } from '@modules/user/use-case/use-case.module'

@Module({
    imports: [UserUseCaseModule],
    controllers: [UserController],
    providers: [UserRepository],
})
export class UserModule {}
