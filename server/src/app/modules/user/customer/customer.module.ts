import { Module } from '@esliph/module'
import { CustomerController } from '@modules/user/customer/customer.controller'
import { CustomerRepository } from '@modules/user/customer/customer.repository'

@Module({
    imports: [],
    controllers: [CustomerController],
    providers: [CustomerRepository],
})
export class CustomerModule { }
