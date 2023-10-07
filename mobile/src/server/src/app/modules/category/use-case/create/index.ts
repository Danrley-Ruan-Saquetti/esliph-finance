import { z } from 'zod'
import { UseCase } from '../../../../../common/use-case'
import { Result } from '@esliph/util-node'
import { ZodValidateService } from '../../../../../services/formatter'
import { CategoryCreateRepository } from '../../repository/create'
import { ListenerRepositoryClient } from '../../../../../services/http'

const CategoryCreateSchema = z.object({
    name: z.string().trim().min(1, { message: 'O "Nome" da categoria é obrigatório' }).max(25, { message: 'O "Nome" da categoria deve ser menor que 25 caracteres' }),
    order: z.number().optional(),
    isFavorite: z.coerce.boolean().default(false),
    accentColor: z.string().default('#fff'),
})

export type CategoryCreateArgs = z.input<typeof CategoryCreateSchema>
export type CategoryCreateResponse = any

export class CategoryCreateUseCase extends UseCase<CategoryCreateResponse, CategoryCreateArgs> {
    private readonly observerRepository: ListenerRepositoryClient

    constructor() {
        super()

        this.observerRepository = new ListenerRepositoryClient()
    }

    async perform(args: CategoryCreateArgs) {
        const argsValidate = ZodValidateService.performParse(args, CategoryCreateSchema)

        if (!argsValidate.isSuccess()) {
            throw Result.failure(argsValidate.getError(), argsValidate.getStatus())
        }

        const { accentColor, isFavorite, name, order } = argsValidate.getValue()

        const response = await this.observerRepository.post('categories/create', { accentColor, isFavorite, name, order: order || 0 })

        if (!response.isSuccess()) {
            return Result.failure({ title: 'Registrar Categoria', message: 'Não foi possível registrar a categoria', causes: response.getError().causes })
        }

        return Result.success(response)
    }
}