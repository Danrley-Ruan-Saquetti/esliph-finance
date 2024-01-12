import { Module } from '@esliph/module'
import { UserController } from '@modules/user/user.controller'
import { UserRepository } from '@modules/user/user.repository'
import { UserUseCaseModule } from '@modules/user/use-case/use-case.module'
import { CustomerModule } from '@modules/user/customer/customer.module'

@Module({
    imports: [UserUseCaseModule, CustomerModule],
    controllers: [UserController],
    providers: [UserRepository],
})
export class UserModule { }
