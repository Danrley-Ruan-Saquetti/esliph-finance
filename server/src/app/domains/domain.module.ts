import { Module } from '@server/components/module'
import { CustomerModule } from '@domains/customer/customer.module'

@Module({
    imports: [
        CustomerModule,
    ]
})
export class DomainModule { }