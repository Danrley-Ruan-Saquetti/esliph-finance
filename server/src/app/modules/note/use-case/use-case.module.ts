import { Module } from '@esliph/module'
import { NoteCreateManyUseCase } from '@modules/note/use-case/create.use-case'

@Module({
    providers: [NoteCreateManyUseCase],
})
export class NoteUseCaseModule { }
