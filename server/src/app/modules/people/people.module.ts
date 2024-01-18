import { Module } from '@core'
import { PeopleController } from '@modules/people/people.controller'
import { PeopleRepository } from '@modules/people/people.repository'
import { PeopleUseCaseModule } from '@modules/people/use-case/use-case.module'
import { PeopleBelongControl } from '@modules/people/control/belong.control'

@Module({
    imports: [PeopleUseCaseModule],
    controllers: [PeopleController],
    providers: [PeopleRepository, PeopleBelongControl],
})
export class PeopleModule { }
