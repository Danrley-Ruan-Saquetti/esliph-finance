import { AccountSchema } from './../account.schema'
import { AccountRepository } from '.'
import { Result } from '@esliph/util-node'
import { RepositoryEsliph } from '@esliph/util-node'
import { Service } from '../../../../common/service'
import { Inversion } from '../../../../core/injection'

export type AccountCreateRepositoryResponse = RepositoryEsliph.CreateResponse<AccountSchema>

export class AccountCreateRepository extends Service {
    private readonly createRepository: AccountRepository

    constructor() {
        super()
        this.createRepository = new AccountRepository()
    }

    static initComponents() {
        Inversion.container.bind('AccountCreateRepository').to(AccountCreateRepository)
    }

    async perform(args: AccountSchema) {
        const account = Result.success<AccountCreateRepositoryResponse>(this.createRepository.create({ data: args }))

        return account
    }
}
