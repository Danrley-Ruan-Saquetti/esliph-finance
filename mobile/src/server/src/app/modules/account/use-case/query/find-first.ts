import { Result } from '@esliph/util-node'
import { z } from 'zod'
import { ZodValidateService } from '../../../../../services/formatter'
import { ListenerRepositoryClient } from '../../../../../services/http'
import { UseCase } from '../../../../../common/use-case'
import { AccountQueryRepositoryResponse } from '../../repository/query'
import { FindFirstResponse } from '@esliph/util-node/dist/lib/repository-memory'
import { AccountSchemaWithoutPassword } from '../../account.schema'

const AccountQuerySchema = z
    .object({
        id: z.number().optional(),
        login: z.string().trim().optional(),
    })
    .refine(({ id, login }) => !!id || !!login, { message: 'Informe ao menos o "Identificador" ou o "Login" da conta para fazer a busca' })

export type AccountQueryArgs = z.output<typeof AccountQuerySchema>
export type AccountQueryResponse = { account: FindFirstResponse<AccountSchemaWithoutPassword> }

export class AccountQueryUseCase extends UseCase<AccountQueryResponse, AccountQueryArgs> {
    private readonly observerRepository: ListenerRepositoryClient

    constructor() {
        super()
        this.observerRepository = new ListenerRepositoryClient()
    }

    async perform(args: AccountQueryArgs) {
        const argsValidate = ZodValidateService.performParse(args, AccountQuerySchema)

        if (!argsValidate.isSuccess()) {
            return Result.failure(argsValidate.getError(), argsValidate.getStatus())
        }

        const { id, login } = argsValidate.getValue()

        let response: Result<AccountQueryRepositoryResponse> = Result.failure({
            title: 'Consulta de Conta',
            message: 'Informe ao menos o "Identificador" ou o "Login" da conta para fazer a busca',
        })
        if (id) {
            response = await this.observerRepository.get('accounts/find?id', { id })
        } else if (login) {
            response = await this.observerRepository.get('accounts/find?login', { login })
        }

        if (!response.isSuccess()) {
            return Result.failure(response.getError(), response.getStatus())
        }

        return Result.success<AccountQueryResponse>({ account: {
            id: response.getValue().id,
            createAt: response.getValue().createAt,
            login: response.getValue().login,
            name: response.getValue().name,
            updateAt: response.getValue().updateAt,
        } })
    }
}
