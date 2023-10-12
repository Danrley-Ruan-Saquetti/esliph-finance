import { Result, RepositoryEsliph } from '@esliph/util-node'
import { AccountSchema } from './../account.schema'
import { AccountRepository } from '.'
import { Service } from '../../../../common/service'
import { Inversion } from '../../../../core/injection'

export type AccountCreateRepositoryResponse = RepositoryEsliph.CreateResponse<AccountSchema>

@Inversion.Injectable('AccountCreateRepository')
export class AccountCreateRepository extends Service {
    private readonly createRepository: AccountRepository

    constructor() {
        super()
        this.createRepository = new AccountRepository()
    }

    async perform(args: AccountSchema) {
        const account = Result.success<AccountCreateRepositoryResponse>(this.createRepository.create({ data: args }))

        return account
    }
}
