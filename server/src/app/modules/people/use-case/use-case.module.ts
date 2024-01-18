import { Module } from '@core'
import { PeopleUpdateUseCase } from '@modules/people/use-case/update.use-case'
import { PeopleQueryUseCase } from '@modules/people/use-case/query.use-case'
import { PeopleCreateUseCase } from '@modules/people/use-case/create.use-case'

@Module({
    providers: [PeopleCreateUseCase, PeopleUpdateUseCase, PeopleQueryUseCase],
})
export class PeopleUseCaseModule { }
