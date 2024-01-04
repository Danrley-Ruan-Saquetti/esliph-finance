import * as Database from '@services/database.service'
import { DocumentSimple } from '@@types/index'

export namespace NoteModel {
    export type Note = Database.Note
    export type Model = DocumentSimple<Note>
}
