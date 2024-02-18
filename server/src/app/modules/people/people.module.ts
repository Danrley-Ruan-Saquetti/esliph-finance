import { Module } from '@core'
import { PeopleClientController } from '@modules/people/people.client.controller'
import { PeopleAdminController } from '@modules/people/people.admin.controller'
import { PeopleRepository } from '@modules/people/people.repository'
import { PeopleUseCaseModule } from '@modules/people/use-case/use-case.module'
import { PeopleBelongControl } from '@modules/people/control/belong.control'

@Module({
    imports: [PeopleUseCaseModule],
    controllers: [PeopleClientController, PeopleAdminController],
    providers: [PeopleRepository, PeopleBelongControl],
})
export class PeopleModule { }
