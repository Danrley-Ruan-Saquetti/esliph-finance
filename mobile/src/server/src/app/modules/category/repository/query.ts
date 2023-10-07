import { Result } from '@esliph/util-node'
import { RepositoryEsliph } from '@esliph/util-node'
import { CategoryRepository } from '.'
import { CategorySchema } from '../category.schema'

export type CategoryQueryByNameRepository = { name: string }
export type CategoryQueryByIdRepository = { id: number }
export type CategoryQueryAllRepository = undefined
export type CategoryQueryOneRepositoryResponse = RepositoryEsliph.Document<CategorySchema>
export type CategoryQueryAllRepositoryResponse = RepositoryEsliph.Document<CategorySchema>[]

export class CategoryQueryRepository {
    protected readonly repository: CategoryRepository

    constructor() {
        this.repository = new CategoryRepository()
    }

    async findByName({ name }: CategoryQueryByNameRepository) {
        const response = this.repository.findFirst({ where: { name: { equals: name } } })

        if (!response) {
            return Result.failure({ title: 'Consulta de Categoria', message: `Categoria "${name}" não encontrada` })
        }

        return Result.success<CategoryQueryOneRepositoryResponse>(response)
    }

    async findById({ id }: CategoryQueryByIdRepository) {
        const response = this.repository.findFirst({ where: { id: { equals: id } } })

        if (!response) {
            return Result.failure({ title: 'Consulta de Categoria', message: `Categoria não encontrada com o identificador "${id}"` })
        }

        return Result.success<CategoryQueryOneRepositoryResponse>(response)
    }

    async findAll() {
        const response = this.repository.findMany({})

        return Result.success<CategoryQueryAllRepositoryResponse>(response)
    }
}
