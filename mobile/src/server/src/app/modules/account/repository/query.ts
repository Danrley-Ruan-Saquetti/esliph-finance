import { Result } from '@esliph/util-node'
import { Document, FindFirstResponse } from '@esliph/util-node/dist/lib/repository-memory'
import { AccountRepository } from '.'
import { AccountSchema } from '../account.schema'

export type AccountQueryRepositoryByName = { name: string }
export type AccountQueryRepositoryByLogin = { login: string }
export type AccountQueryRepositoryById = { id: number }
export type AccountQueryRepositoryResponse = Document<AccountSchema>

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

    async findById({ id }: AccountQueryRepositoryById) {
        const response = this.repository.findFirst({ where: { id: { equals: id } } })

        if (!response) {
            return Result.failure({ title: 'Consulta de Conta', message: `Conta não encontrada com o identificador "${id}"` })
        }

        return Result.success<AccountQueryRepositoryResponse>(response)
    }
}
