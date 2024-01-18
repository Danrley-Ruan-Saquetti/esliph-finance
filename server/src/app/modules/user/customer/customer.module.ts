import { Module } from '@core'
import { CustomerController } from '@modules/user/customer/customer.controller'
import { CustomerRepository } from '@modules/user/customer/customer.repository'

@Module({
    imports: [],
    controllers: [CustomerController],
    providers: [CustomerRepository],
})
export class CustomerModule { }
