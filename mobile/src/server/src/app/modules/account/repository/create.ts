import { AccountSchema } from './../account.schema'
import { AccountRepository } from '.'

export class AccountCreateRepository {
    private readonly createRepository: AccountRepository

    constructor() {
        this.createRepository = new AccountRepository()
    }

    async perform(args: AccountSchema) {
        return this.createRepository.create({ data: args })
    }
}
