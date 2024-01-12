import { Module } from '@esliph/module'
import { PeopleUpdateUseCase } from '@modules/people/use-case/update.use-case'
import { PeopleQueryUseCase } from '@modules/people/use-case/query.use-case'
import { PeoplePeopleUseCase } from '@modules/people/use-case/create.use-case'

@Module({
    providers: [PeoplePeopleUseCase, PeopleUpdateUseCase, PeopleQueryUseCase],
})
export class PeopleUseCaseModule { }
