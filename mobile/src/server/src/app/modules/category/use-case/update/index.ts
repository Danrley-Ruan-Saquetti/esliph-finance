import { Result } from '@esliph/util-node'
import { z } from 'zod'
import { ZodValidateService } from '../../../../../services/formatter'
import { ListenerRepositoryClient } from '../../../../../services/http'
import { UseCase } from '../../../../../common/use-case'
import { BadRequestException } from '../../../../../common/exception/bad-request.exception'

const CategoryUpdateSchema = z.object({
    name: z.string().trim().optional(),
    login: z.string().trim().optional(),
})

export type CategoryUpdateArgs = z.input<typeof CategoryUpdateSchema>
export type CategoryUpdateArgsHeader = { accountId: number }
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

        const { login, name, accountId } = { ...argsValidate.getValue(), ...args }

        if (!accountId) {
            throw new BadRequestException({ title: 'Atualizar Conta', message: 'Você precisa informar o identificador da conta atualizá-la' })
        }

        const accountToUpdate = await this.listenerRepository.get('DB:accounts/find?id', { id: accountId })

        if (!accountToUpdate.isSuccess()) {
            throw new BadRequestException(
                { title: 'Atualizar Conta', message: `Não foi possível encontrar a conta com o identificador "${accountId}"` },
            )
        }

        const responseUpdate = await this.listenerRepository.put('DB:accounts/update', { login, name, id: accountId })

        if (!responseUpdate.isSuccess()) {
            throw new BadRequestException({ title: 'Atualizar Conta', message: 'Não foi possível atualizar a conta', causes: responseUpdate.getError().causes })
        }

        return Result.success({ message: 'Conta atualizada com sucesso' })
    }
}
