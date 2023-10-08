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
    private readonly observerRepository: ListenerRepositoryClient
    private readonly observerClient: ListenerPublicClient

    constructor() {
        super()

        this.observerRepository = new ListenerRepositoryClient()
        this.observerClient = new ListenerPublicClient()
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

        const responseAccount = await this.observerClient.get('accounts/find?id', { id: accountId })

        if (!responseAccount.isSuccess()) {
            throw new HttpException(responseAccount.getError(), responseAccount.getStatus())
        }

        const response = await this.observerRepository.post('categories/create', { accentColor, isFavorite, name, order: order || 0, accountId })

        if (!response.isSuccess()) {
            throw new BadRequestException({ title: 'Registrar Categoria', message: 'Não foi possível registrar a categoria', causes: response.getError().causes })
        }

        return Result.success<CategoryCreateResponse>({ message: 'Categoria criada com sucesso' })
    }
}