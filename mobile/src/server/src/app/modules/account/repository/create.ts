import { AccountSchema } from './../account.schema'
import { AccountRepository } from '.'
import { AccountQueryRepository } from './query'
import { HttpStatusCodes, Result } from '@esliph/util-node'

export class AccountCreateRepository {
    private readonly createRepository: AccountRepository
    private readonly queryRepository: AccountQueryRepository

    constructor() {
        this.createRepository = new AccountRepository()
        this.queryRepository = new AccountQueryRepository()
    }

    async perform(args: AccountSchema) {
        const accountWithLogin = await this.queryRepository.findByLogin(args.login)

        if (accountWithLogin) {
            throw Result.failure({ title: 'Create Account', message: `Already exists account with login "${args.login}"` }, HttpStatusCodes.BAD_REQUEST)
        }

        return this.createRepository.create({ data: args })
    }
}