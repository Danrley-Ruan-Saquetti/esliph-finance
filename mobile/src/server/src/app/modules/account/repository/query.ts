import { AccountSchema } from '../account.schema'
import { AccountRepository } from '.'

export class AccountQueryRepository {
    protected readonly repository: AccountRepository

    constructor() {
        this.repository = new AccountRepository()
    }

    async findByName(name: string) {
        const response = this.repository.findFirst({ where: { name: { equals: name } } })

        return response
    }

    async findByLogin(login: string) {
        const response = this.repository.findFirst({ where: { login: { equals: login } } })

        return response
    }
}