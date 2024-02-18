import { Module } from '@core'
import { UserClientController } from '@modules/user/user.client.controller'
import { UserAdminController } from '@modules/user/user.admin.controller'
import { UserRepository } from '@modules/user/user.repository'
import { UserUseCaseModule } from '@modules/user/use-case/use-case.module'
import { CustomerModule } from '@modules/user/customer/customer.module'

@Module({
    imports: [UserUseCaseModule, CustomerModule],
    controllers: [UserClientController, UserAdminController],
    providers: [UserRepository],
})
export class UserModule { }
