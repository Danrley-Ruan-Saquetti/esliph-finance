import * as Database from '@services/database.service'
import { DocumentSimple } from '@@types'

export namespace CategoryModel {
    export type Category = Database.Category
    export type Model = DocumentSimple<Category>
    export type UpdateArgs = Partial<Pick<Model, 'color' | 'isFavorite' | 'name'>>
}
