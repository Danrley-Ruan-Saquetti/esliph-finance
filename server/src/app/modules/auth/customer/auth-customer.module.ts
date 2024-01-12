import { Module } from '@esliph/module'
import { AuthCustomerController } from '@modules/auth/customer/auth-customer.controller'
import { CustomerAuthorizationFilter } from '@modules/auth/customer/filters/authorization.filter'
import { AuthCustomerUseCaseModule } from '@modules/auth/customer/use-case/use-case.module'

@Module({
    imports: [AuthCustomerUseCaseModule],
    controllers: [AuthCustomerController],
    providers: [
        CustomerAuthorizationFilter,
        { use: 'customer.filter.authorization', whenCall: 'customer.authorization' },
    ],
})
export class AuthCustomerModule { }
