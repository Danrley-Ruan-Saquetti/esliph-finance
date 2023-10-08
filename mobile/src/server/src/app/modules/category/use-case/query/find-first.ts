import { RepositoryEsliph, Result } from '@esliph/util-node'
import { z } from 'zod'
import { ZodValidateService } from '../../../../../services/formatter'
import { ListenerRepositoryClient } from '../../../../../services/http'
import { UseCase } from '../../../../../common/use-case'
import { CategoryQueryOneRepositoryResponse } from '../../repository/query'
import { CategorySchema } from '../../category.schema'
import { BadRequestException } from '../../../../../common/exception/bad-request.exception'
import { HttpException } from '../../../../../common/exception'

const CategoryFindFirstSchema = z
    .object({
        id: z.number().optional(),
        name: z.string().trim().optional(),
    })
    .refine(({ id, name }) => !!id || !!name, { message: 'Informe ao menos o "Identificador" ou o "Nome" da categoria para fazer a busca' })

export type CategoryFindFirstArgs = z.output<typeof CategoryFindFirstSchema>
export type CategoryFindFirstArgsHeader = { accountId: number }
export type CategoryFindFirstResponse = { category: RepositoryEsliph.Document<CategorySchema> }

export class CategoryFindFirstUseCase extends UseCase<CategoryFindFirstResponse, CategoryFindFirstArgs> {
    private readonly observerRepository: ListenerRepositoryClient

    constructor() {
        super()
        this.observerRepository = new ListenerRepositoryClient()
    }

    async perform(args: CategoryFindFirstArgs & CategoryFindFirstArgsHeader) {
        const argsValidate = ZodValidateService.performParse(args, CategoryFindFirstSchema)

        if (!argsValidate.isSuccess()) {
            throw new BadRequestException(argsValidate.getError())
        }

        const { id, name, accountId } = { ...argsValidate.getValue(), ...args }

        let response: Result<CategoryQueryOneRepositoryResponse> = Result.failure({
            title: 'Consulta de Conta',
            message: 'Informe ao menos o "Identificador" ou o "Login" da conta para fazer a busca',
        })

        if (id) {
            response = await this.observerRepository.get('categories/find?id', { id, accountId })
        } else if (name) {
            response = await this.observerRepository.get('categories/find?name', { name, accountId })
        }

        if (!response.isSuccess()) {
            throw new HttpException(response.getError(), response.getStatus())
        }

        return Result.success<CategoryFindFirstResponse>({
            category: response.getValue(),
        })
    }
}
