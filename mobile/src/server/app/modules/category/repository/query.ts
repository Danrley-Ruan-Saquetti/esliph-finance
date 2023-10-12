import { Result } from '@esliph/util-node'
import { RepositoryEsliph } from '@esliph/util-node'
import { CategoryRepository } from '.'
import { CategorySchema } from '../category.schema'

export type CategoryQueryByNameRepository = { accountId: number, name: string }
export type CategoryQueryByIdRepository = { accountId: number, id: number }
export type CategoryQueryAllRepository = { accountId: number }
export type CategoryQueryOneRepositoryResponse = RepositoryEsliph.Document<CategorySchema>
export type CategoryQueryAllRepositoryResponse = RepositoryEsliph.Document<CategorySchema>[]

export class CategoryQueryRepository {
    protected readonly repository: CategoryRepository

    constructor() {
        this.repository = new CategoryRepository()
    }

    async findByName({ name, accountId }: CategoryQueryByNameRepository) {
        const response = this.repository.findFirst({ where: { name: { equals: name }, accountId: { equals: accountId } } })

        if (!response) {
            return Result.failure({ title: 'Consulta de Categoria', message: `Categoria "${name}" não encontrada` })
        }

        return Result.success<CategoryQueryOneRepositoryResponse>(response)
    }

    async findById({ id, accountId }: CategoryQueryByIdRepository) {
        const response = this.repository.findFirst({ where: { id: { equals: id }, accountId: { equals: accountId } } })

        if (!response) {
            return Result.failure({ title: 'Consulta de Categoria', message: `Categoria não encontrada com o identificador "${id}"` })
        }

        return Result.success<CategoryQueryOneRepositoryResponse>(response)
    }

    async findAll({ accountId }: CategoryQueryAllRepository) {
        const response = this.repository.findMany({
            where: { accountId: { equals: accountId } }, orderBy:
                [{ isFavorite: 'DESC' }, { order: 'DESC' }, { id: 'DESC' }]
        })

        return Result.success<CategoryQueryAllRepositoryResponse>(response)
    }
}
