import { Module } from '@esliph/module'
import { NoteQueryUseCase } from '@modules/note/use-case/query.use-case'
import { NoteCreateManyUseCase } from '@modules/note/use-case/create.use-case'

@Module({
    providers: [NoteCreateManyUseCase, NoteQueryUseCase],
})
export class NoteUseCaseModule { }
