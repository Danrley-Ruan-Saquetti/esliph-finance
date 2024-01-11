import { Module } from '@esliph/module'
import { PeopleController } from '@modules/people/people.controller'
import { PeopleRepository } from '@modules/people/people.repository'
import { PeopleUseCaseModule } from '@modules/people/use-case/use-case.module'

@Module({
    imports: [PeopleUseCaseModule],
    controllers: [PeopleController],
    providers: [PeopleRepository],
})
export class PeopleModule { }
