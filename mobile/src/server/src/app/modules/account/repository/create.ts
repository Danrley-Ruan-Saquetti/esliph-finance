import { AccountSchema } from './../account.schema'
import { AccountRepository } from '.'
import { Result } from '@esliph/util-node'
import { CreateResponse } from '@esliph/util-node/dist/lib/repository-memory'

export type AccountCreateRepositoryResponse = CreateResponse<AccountSchema>

export class AccountCreateRepository {
    private readonly createRepository: AccountRepository

    constructor() {
        this.createRepository = new AccountRepository()
    }

    async perform(args: AccountSchema) {
        const account = Result.success<AccountCreateRepositoryResponse>(this.createRepository.create({ data: args }))

        return account
    }
}
