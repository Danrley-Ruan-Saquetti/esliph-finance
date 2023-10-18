import { AccountSchema } from '../account.schema'
import { AccountRepository } from '.'
import { Result } from '@esliph/util-node'
import { Service } from '../../../../common/service'

export type AccountUpdateRepositoryArgs = Partial<AccountSchema> & { id: number }
export type AccountUpdateRepositoryResponse = { message: string }

export class AccountUpdateRepository extends Service {
    private readonly updateRepository: AccountRepository

    constructor() {
        super()
        this.updateRepository = new AccountRepository()
    }

    async perform(args: AccountUpdateRepositoryArgs) {
        this.updateRepository.update({
            where: { id: { equals: args.id } },
            data: { ...(args.login && { login: args.login }), ...(args.name && { name: args.name }) },
        })

        return Result.success<AccountUpdateRepositoryResponse>({ message: 'Conta atualizada com sucesso' })
    }
}
