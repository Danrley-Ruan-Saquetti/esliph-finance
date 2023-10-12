import { ModelSchema } from '@esliph/util-node'
import { CategorySchema } from '../category.schema'

export class CategoryRepository extends ModelSchema<CategorySchema> {
    constructor() {
        super('Category')
    }
}