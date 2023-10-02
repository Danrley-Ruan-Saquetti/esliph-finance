import { AccountSchema } from './../account.schema'
import { AccountRepository } from '.'

export class AccountCreateRepository {
    protected readonly repository: AccountRepository

    constructor() {
        this.repository = new AccountRepository()
    }

    async perform(args: AccountSchema) {
        return this.repository.create({ data: args })
    }
}