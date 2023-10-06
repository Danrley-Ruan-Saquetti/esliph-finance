import { Result } from '@esliph/util-node'
import { z } from 'zod'
import { ListenerRepositoryClient } from '../../../../../services/http'
import { UseCase } from '../../../../../common/use-case'
import { RepositoryEsliph } from '@esliph/util-node'
import { AccountSchemaWithoutPassword } from '../../account.schema'

const AccountFindManySchema = z.object({})

export type AccountFindManyArgs = z.output<typeof AccountFindManySchema>
export type AccountFindManyResponse = { accounts: RepositoryEsliph.FindFirstResponse<AccountSchemaWithoutPassword>[] }

export class AccountFindManyUseCase extends UseCase<AccountFindManyResponse, AccountFindManyArgs> {
    private readonly observerRepository: ListenerRepositoryClient

    constructor() {
        super()
        this.observerRepository = new ListenerRepositoryClient()
    }

    async perform() {
        const response = await this.observerRepository.get('accounts/find-all', {} as any)

        if (!response.isSuccess()) {
            return Result.failure(response.getError(), response.getStatus())
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
