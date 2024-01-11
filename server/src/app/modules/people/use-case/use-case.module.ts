import { Module } from '@esliph/module'
import { PeopleUpdateUseCase } from '@modules/people/use-case/update.use-case'
import { PeopleQueryUseCase } from '@modules/people/use-case/query.use-case'

@Module({
    providers: [PeopleUpdateUseCase, PeopleQueryUseCase],
})
export class PeopleUseCaseModule { }
