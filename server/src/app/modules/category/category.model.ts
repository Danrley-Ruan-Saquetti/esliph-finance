import * as Database from '@services/database.service'
import { DocumentSimple } from '@@types/index'

export namespace CategoryModel {
    export type Category = Database.Category
    export type Model = DocumentSimple<Category>
}