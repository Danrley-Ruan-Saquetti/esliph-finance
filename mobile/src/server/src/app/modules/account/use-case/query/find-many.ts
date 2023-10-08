import { Result } from '@esliph/util-node'
import { z } from 'zod'
import { ListenerRepositoryClient } from '../../../../../services/http'
import { UseCase } from '../../../../../common/use-case'
import { RepositoryEsliph } from '@esliph/util-node'
import { AccountSchemaWithoutPassword } from '../../account.schema'
import { HttpException } from '../../../../../common/exception'

const AccountFindManySchema = z.object({})

export type AccountFindManyArgs = z.input<typeof AccountFindManySchema>
export type AccountFindManyResponse = { accounts: RepositoryEsliph.FindFirstResponse<AccountSchemaWithoutPassword>[] }

export class AccountFindManyUseCase extends UseCase<AccountFindManyResponse, AccountFindManyArgs> {
    private readonly listenerRepository: ListenerRepositoryClient

    constructor() {
        super()
        this.listenerRepository = new ListenerRepositoryClient()
    }

    async perform() {
        const response = await this.listenerRepository.get('DB:accounts/find-all', {} as any)

        if (!response.isSuccess()) {
            throw new HttpException(response.getError(), response.getStatus())
        }

        return Result.success<AccountFindManyResponse>({
            accounts: response.getValue().map(({ createAt, id, login, name, updateAt }) => ({
                createAt,
                id,
                login,
                name,
                updateAt,
            })),
        })
    }
}
