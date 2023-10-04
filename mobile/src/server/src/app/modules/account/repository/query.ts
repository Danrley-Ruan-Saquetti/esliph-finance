import { Result } from '@esliph/util-node'
import { Document } from '@esliph/util-node/dist/lib/repository-memory'
import { AccountRepository } from '.'
import { AccountSchema } from '../account.schema'

export type AccountQueryByNameRepository = { name: string }
export type AccountQueryByLoginRepository = { login: string }
export type AccountQueryByIdRepository = { id: number }
export type AccountQueryAllRepository = undefined
export type AccountQueryOneRepositoryResponse = Document<AccountSchema>
export type AccountQueryAllRepositoryResponse = Document<AccountSchema>[]

export class AccountQueryRepository {
    protected readonly repository: AccountRepository

    constructor() {
        this.repository = new AccountRepository()
    }

    async findByName({ name }: AccountQueryByNameRepository) {
        const response = this.repository.findFirst({ where: { name: { equals: name } } })

        if (!response) {
            return Result.failure({ title: 'Consulta de Conta', message: `Conta "${name}" não encontrada` })
        }

        return Result.success<AccountQueryOneRepositoryResponse>(response)
    }

    async findByLogin({ login }: AccountQueryByLoginRepository) {
        const response = this.repository.findFirst({ where: { login: { equals: login } } })

        if (!response) {
            return Result.failure({ title: 'Consulta de Conta', message: `Conta "${login}" não encontrada` })
        }

        return Result.success<AccountQueryOneRepositoryResponse>(response)
    }

    async findById({ id }: AccountQueryByIdRepository) {
        const response = this.repository.findFirst({ where: { id: { equals: id } } })

        if (!response) {
            return Result.failure({ title: 'Consulta de Conta', message: `Conta não encontrada com o identificador "${id}"` })
        }

        return Result.success<AccountQueryOneRepositoryResponse>(response)
    }

    async findAll() {
        const response = this.repository.findMany({})

        return Result.success<AccountQueryAllRepositoryResponse>(response)
    }
}
