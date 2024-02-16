import { Module } from '@core'
import { UserCustomerController } from '@modules/user/user.customer.controller'
import { UserAdminController } from '@modules/user/user.admin.controller'
import { UserRepository } from '@modules/user/user.repository'
import { UserUseCaseModule } from '@modules/user/use-case/use-case.module'
import { CustomerModule } from '@modules/user/customer/customer.module'

@Module({
    imports: [UserUseCaseModule, CustomerModule],
    controllers: [UserCustomerController, UserAdminController],
    providers: [UserRepository],
})
export class UserModule { }
