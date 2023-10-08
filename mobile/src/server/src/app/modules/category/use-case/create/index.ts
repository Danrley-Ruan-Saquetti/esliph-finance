import { z } from 'zod'
import { UseCase } from '../../../../../common/use-case'
import { Result } from '@esliph/util-node'
import { ZodValidateService } from '../../../../../services/formatter'
import { CategoryCreateRepository } from '../../repository/create'
import { ListenerPublicClient, ListenerRepositoryClient } from '../../../../../services/http'
import { BadRequestException } from '../../../../../common/exception/bad-request.exception'
import { HttpException } from '../../../../../common/exception'

const CategoryCreateSchema = z.object({
    name: z.string().trim().min(1, { message: 'O "Nome" da categoria é obrigatório' }).max(25, { message: 'O "Nome" da categoria deve ser menor que 25 caracteres' }),
    order: z.number().optional(),
    isFavorite: z.coerce.boolean().default(false),
    accentColor: z.string().default('#fff'),
})

export type CategoryCreateArgs = z.input<typeof CategoryCreateSchema>
export type CategoryCreateArgsHeader = { accountId: number }
export type CategoryCreateResponse = { message: string }

export class CategoryCreateUseCase extends UseCase<CategoryCreateResponse, CategoryCreateArgs> {
    private readonly listenerRepository: ListenerRepositoryClient
    private readonly listenerClient: ListenerPublicClient

    constructor() {
        super()

        this.listenerRepository = new ListenerRepositoryClient()
        this.listenerClient = new ListenerPublicClient()
    }

    async perform(args: CategoryCreateArgs & CategoryCreateArgsHeader) {
        const argsValidate = ZodValidateService.performParse(args, CategoryCreateSchema)

        if (!argsValidate.isSuccess()) {
            throw new BadRequestException(argsValidate.getError())
        }

        const { accentColor, isFavorite, name, order, accountId } = { ...args, ...argsValidate.getValue() }

        if (!accountId) {
            throw new BadRequestException({ title: 'Registrar Categoria', message: 'Você precisa informar o identificador da conta para vincular a categoria a ela' })
        }

        const responseAccount = await this.listenerClient.get('accounts/find?id', { id: accountId })

        if (!responseAccount.isSuccess()) {
            throw new HttpException(responseAccount.getError(), responseAccount.getStatus())
        }

        let newOrder = order || 1

        if (!order) {
            const allCategories = await this.listenerRepository.get('categories/find-all', { accountId })

            if (allCategories.isSuccess()) {
                newOrder = allCategories.getValue().length + 1
            }
        }

        const response = await this.listenerRepository.post('categories/create', { accentColor, isFavorite, name, order: newOrder, accountId })

        if (!response.isSuccess()) {
            throw new BadRequestException({ title: 'Registrar Categoria', message: 'Não foi possível registrar a categoria', causes: response.getError().causes })
        }

        return Result.success<CategoryCreateResponse>({ message: 'Categoria criada com sucesso' })
    }
}