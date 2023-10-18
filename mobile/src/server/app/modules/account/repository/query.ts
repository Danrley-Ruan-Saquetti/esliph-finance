import { Result, RepositoryEsliph } from '@esliph/util-node'
import { AccountRepository } from '.'
import { AccountSchema } from '../account.schema'
import { DatabaseException } from '../../../../common/exception'
import { Service } from '../../../../common/service'

export type AccountQueryByNameRepository = { name: string }
export type AccountQueryByLoginRepository = { login: string }
export type AccountQueryByIdRepository = { id: number }
export type AccountQueryAllRepository = undefined
export type AccountQueryIsExistsRepositoryResponse = boolean
export type AccountQueryOneRepositoryResponse = RepositoryEsliph.Document<AccountSchema>
export type AccountQueryAllRepositoryResponse = RepositoryEsliph.Document<AccountSchema>[]

export class AccountQueryRepository extends Service {
    protected readonly repository: AccountRepository

    constructor() {
        super()
        this.repository = new AccountRepository()
    }

    async findByName({ name }: AccountQueryByNameRepository) {
        const response = this.repository.findFirst({ where: { name: { equals: name } } })

        if (!response) {
            throw new DatabaseException({ title: 'Consulta de Conta', message: `Conta "${name}" não encontrada` })
        }

        return Result.success<AccountQueryOneRepositoryResponse>(response)
    }

    async findByLogin({ login }: AccountQueryByLoginRepository) {
        const response = this.repository.findFirst({ where: { login: { equals: login } } })

        if (!response) {
            throw new DatabaseException({ title: 'Consulta de Conta', message: `Conta "${login}" não encontrada` })
        }

        return Result.success<AccountQueryOneRepositoryResponse>(response)
    }

    async findById({ id }: AccountQueryByIdRepository) {
        const response = this.repository.findFirst({ where: { id: { equals: id } } })

        if (!response) {
            throw new DatabaseException({ title: 'Consulta de Conta', message: `Conta não encontrada com o identificador "${id}"` })
        }

        return Result.success<AccountQueryOneRepositoryResponse>(response)
    }

    async isExistsByLogin({ login }: AccountQueryByLoginRepository) {
        const response = this.repository.isExists({ where: { login: { equals: login } } })

        return Result.success<AccountQueryIsExistsRepositoryResponse>(response)
    }

    async findAll() {
        const response = this.repository.findMany({})

        return Result.success<AccountQueryAllRepositoryResponse>(response)
    }
}
