import { AccountSchema } from './../account.schema'
import { AccountRepository } from '.'
import { Result } from '@esliph/util-node'

export class AccountCreateRepository {
    private readonly createRepository: AccountRepository

    constructor() {
        this.createRepository = new AccountRepository()
    }

    async perform(args: AccountSchema) {
        return Result.success(this.createRepository.create({ data: args }))
    }
}
