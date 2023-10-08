import { Result } from '@esliph/util-node'
import { z } from 'zod'
import { ListenerRepositoryClient } from '../../../../../services/http'
import { UseCase } from '../../../../../common/use-case'
import { RepositoryEsliph } from '@esliph/util-node'
import { CategorySchema } from '../../category.schema'

const CategoryFindManySchema = z.object({
    accountId: z.number().min(1, { message: 'O "Identificador" da conta é obrigatório' })
})

export type CategoryFindManyArgs = z.output<typeof CategoryFindManySchema>
export type CategoryFindManyResponse = { categories: RepositoryEsliph.FindFirstResponse<CategorySchema>[] }

export class CategoryFindManyUseCase extends UseCase<CategoryFindManyResponse, CategoryFindManyArgs> {
    private readonly observerRepository: ListenerRepositoryClient

    constructor() {
        super()
        this.observerRepository = new ListenerRepositoryClient()
    }

    async perform(args: CategoryFindManyArgs) {
        const response = await this.observerRepository.get('categories/find-all', { accountId: args.accountId })

        if (!response.isSuccess()) {
            return Result.failure(response.getError(), response.getStatus())
        }

        return Result.success<CategoryFindManyResponse>({
            categories: response.getValue(),
        })
    }
}
