import { Module } from '@esliph/module'
import { NoteQueryUseCase } from '@modules/note/use-case/query.use-case'
import { NoteCreateManyUseCase } from '@modules/note/use-case/create.use-case'
import { NoteRemoveUseCase } from '@modules/note/use-case/remove.use-case'
import { NoteUpdateUseCase } from '@modules/note/use-case/update.use-case'

@Module({
    providers: [NoteCreateManyUseCase, NoteQueryUseCase, NoteRemoveUseCase, NoteUpdateUseCase],
})
export class NoteUseCaseModule { }
