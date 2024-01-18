import { Module } from '@core'
import { NoteController } from '@modules/note/note.controller'
import { NoteRepository } from '@modules/note/note.repository'
import { NoteUseCaseModule } from '@modules/note/use-case/use-case.module'

@Module({
    imports: [NoteUseCaseModule],
    controllers: [NoteController],
    providers: [NoteRepository],
})
export class NoteModule { }
