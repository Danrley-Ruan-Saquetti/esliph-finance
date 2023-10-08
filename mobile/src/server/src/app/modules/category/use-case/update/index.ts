import { Result } from '@esliph/util-node'
import { z } from 'zod'
import { ZodValidateService } from '../../../../../services/formatter'
import { ListenerRepositoryClient } from '../../../../../services/http'
import { UseCase } from '../../../../../common/use-case'
import { BadRequestException } from '../../../../../common/exception/bad-request.exception'

const CategoryUpdateSchema = z.object({
    name: z.string().trim().max(25, { message: 'O "Nome" da categoria deve ser menor que 25 caracteres' }).optional(),
    order: z.number().optional(),
    isFavorite: z.boolean().optional(),
    accentColor: z.string().optional(),
})

export type CategoryUpdateArgs = z.input<typeof CategoryUpdateSchema>
export type CategoryUpdateArgsHeader = { accountId: number, categoryId: number }
export type CategoryUpdateResponse = { message: string }

export class CategoryUpdateUseCase extends UseCase<CategoryUpdateResponse, CategoryUpdateArgs> {
    private readonly listenerRepository: ListenerRepositoryClient

    constructor() {
        super()
        this.listenerRepository = new ListenerRepositoryClient()
    }

    async perform(args: CategoryUpdateArgs & CategoryUpdateArgsHeader) {
        const argsValidate = ZodValidateService.performParse(args, CategoryUpdateSchema)

        if (!argsValidate.isSuccess()) {
            throw new BadRequestException(argsValidate.getError())
        }

        const { accountId, accentColor, isFavorite, name, order, categoryId } = { ...argsValidate.getValue(), ...args }

        if (!accountId) {
            throw new BadRequestException({ title: 'Atualizar Categoria', message: 'Você precisa informar o identificador da conta para atualizá-la' })
        }

        if (!categoryId) {
            throw new BadRequestException({ title: 'Atualizar Categoria', message: 'Você precisa informar o identificador da categoria para atualizá-la' })
        }

        const accountToUpdate = await this.listenerRepository.get('DB:accounts/find?id', { id: accountId })

        if (!accountToUpdate.isSuccess()) {
            throw new BadRequestException(
                { title: 'Atualizar Categoria', message: `Não foi possível encontrar a conta com o identificador "${accountId}"` },
            )
        }

        const responseUpdate = await this.listenerRepository.put('DB:categories/update', { accentColor, isFavorite, name, order, id: categoryId, accountId })

        if (!responseUpdate.isSuccess()) {
            throw new BadRequestException({ title: 'Atualizar Categoria', message: 'Não foi possível atualizar a categoria', causes: responseUpdate.getError().causes })
        }

        return Result.success({ message: 'Categoria atualizada com sucesso' })
    }
}
