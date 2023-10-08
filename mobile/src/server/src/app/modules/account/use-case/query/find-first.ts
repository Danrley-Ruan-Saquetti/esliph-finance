import { RepositoryEsliph, Result } from '@esliph/util-node'
import { z } from 'zod'
import { ZodValidateService } from '../../../../../services/formatter'
import { ListenerRepositoryClient } from '../../../../../services/http'
import { UseCase } from '../../../../../common/use-case'
import { AccountQueryOneRepositoryResponse } from '../../repository/query'
import { AccountSchemaWithoutPassword } from '../../account.schema'
import { BadRequestException } from '../../../../../common/exception/bad-request.exception'

const AccountFindFirstSchema = z
    .object({
        id: z.number().optional(),
        login: z.string().trim().optional(),
    })
    .refine(({ id, login }) => !!id || !!login, { message: 'Informe ao menos o "Identificador" ou o "Login" da conta para fazer a busca' })

export type AccountFindFirstArgs = z.input<typeof AccountFindFirstSchema>
export type AccountFindFirstResponse = { account: RepositoryEsliph.Document<AccountSchemaWithoutPassword> }

export class AccountFindFirstUseCase extends UseCase<AccountFindFirstResponse, AccountFindFirstArgs> {
    private readonly listenerRepository: ListenerRepositoryClient

    constructor() {
        super()
        this.listenerRepository = new ListenerRepositoryClient()
    }

    async perform(args: AccountFindFirstArgs) {
        const argsValidate = ZodValidateService.performParse(args, AccountFindFirstSchema)

        if (!argsValidate.isSuccess()) {
            throw new BadRequestException(argsValidate.getError())
        }

        const { id, login } = argsValidate.getValue()

        let response: Result<AccountQueryOneRepositoryResponse> = Result.failure({
            title: 'Consulta de Conta',
            message: 'Informe ao menos o "Identificador" ou o "Login" da conta para fazer a busca',
        })

        if (id) {
            response = await this.listenerRepository.get('accounts/find?id', { id })
        } else if (login) {
            response = await this.listenerRepository.get('accounts/find?login', { login })
        }

        if (!response.isSuccess()) {
            throw new BadRequestException(response.getError())
        }

        return Result.success<AccountFindFirstResponse>({
            account: {
                id: response.getValue().id,
                createAt: response.getValue().createAt,
                login: response.getValue().login,
                name: response.getValue().name,
                updateAt: response.getValue().updateAt,
            },
        })
    }
}
