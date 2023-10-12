import { CategorySchema } from './../category.schema'
import { CategoryRepository } from '.'
import { Result, RepositoryEsliph } from '@esliph/util-node'

export type CategoryCreateRepositoryResponse = RepositoryEsliph.CreateResponse<CategorySchema>

export class CategoryCreateRepository {
    private readonly createRepository: CategoryRepository

    constructor() {
        this.createRepository = new CategoryRepository()
    }

    async perform(args: CategorySchema) {
        const category = Result.success<CategoryCreateRepositoryResponse>(this.createRepository.create({ data: args }))

        return category
    }
}
