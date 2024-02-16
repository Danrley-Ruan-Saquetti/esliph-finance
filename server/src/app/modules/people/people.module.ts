import { Module } from '@core'
import { PeopleCustomerController } from '@modules/people/people.customer.controller'
import { PeopleAdminController } from '@modules/people/people.admin.controller'
import { PeopleRepository } from '@modules/people/people.repository'
import { PeopleUseCaseModule } from '@modules/people/use-case/use-case.module'
import { PeopleBelongControl } from '@modules/people/control/belong.control'

@Module({
    imports: [PeopleUseCaseModule],
    controllers: [PeopleCustomerController, PeopleAdminController],
    providers: [PeopleRepository, PeopleBelongControl],
})
export class PeopleModule { }
