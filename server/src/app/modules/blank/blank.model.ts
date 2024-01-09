import * as Database from '@services/database.service'
import { Document, DocumentSimple } from '@@types'

export namespace BlankModel {
    export type Blank = Document
    export type Model = DocumentSimple<Blank>
    export type UpdateArgs = Partial<Model>
}
