import { Result } from '@esliph/util-node'
import { CategorySchema } from '../category.schema'
import { CategoryRepository } from '.'

export type CategoryUpdateRepositoryArgs = Partial<CategorySchema> & { accountId: number, id: number }
export type CategoryUpdateRepositoryResponse = { message: string }

export class CategoryUpdateRepository {
    private readonly updateRepository: CategoryRepository

    constructor() {
        this.updateRepository = new CategoryRepository()
    }

    async perform(args: CategoryUpdateRepositoryArgs) {
        this.updateRepository.update({
            where: { id: { equals: args.id }, accountId: { equals: args.accountId } },
            data: {
                ...(args.accentColor && { accentColor: args.accentColor }),
                ...(args.isFavorite && { isFavorite: args.isFavorite }),
                ...(args.name && { name: args.name }),
                ...(args.order && { order: args.order }),
            }
        })

        return Result.success<CategoryUpdateRepositoryResponse>({ message: 'Categoria atualizada com sucesso' })
    }
}
