import { Result } from '@esliph/util-node'
import { FindFirstResponse } from '@esliph/util-node/dist/lib/repository-memory'
import { AccountRepository } from '.'
import { AccountSchema } from '../account.schema'

export type AccountQueryRepositoryByName = { name: string }
export type AccountQueryRepositoryByLogin = { login: string }
export type AccountQueryRepositoryResponse = FindFirstResponse<AccountSchema>

export class AccountQueryRepository {
    protected readonly repository: AccountRepository

    constructor() {
        this.repository = new AccountRepository()
    }

    async findByName({ name }: AccountQueryRepositoryByName) {
        const response = this.repository.findFirst({ where: { name: { equals: name } } })

        if (!response) {
            return Result.failure({ title: 'Consulta de Conta', message: `Conta "${name}" não encontrada` })
        }

        return Result.success<AccountQueryRepositoryResponse>(response)
    }

    async findByLogin({ login }: AccountQueryRepositoryByLogin) {
        const response = this.repository.findFirst({ where: { login: { equals: login } } })

        if (!response) {
            return Result.failure({ title: 'Consulta de Conta', message: `Conta "${login}" não encontrada` })
        }

        return Result.success<AccountQueryRepositoryResponse>(response)
    }
}
