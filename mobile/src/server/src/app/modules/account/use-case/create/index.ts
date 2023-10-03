import { HttpStatusCodes, Result } from '@esliph/util-node'
import { AccountCreateRepository } from '../../repository/create'
import { AccountQueryRepository } from '../../repository/query'

export type AccountCreateArgs = {
    name: string
    login: string
    password: string
}

export class AccountCreateUseCase {
    private readonly createRepository: AccountCreateRepository
    private readonly queryRepository: AccountQueryRepository

    constructor() {
        this.createRepository = new AccountCreateRepository()
        this.queryRepository = new AccountQueryRepository()
    }

    async perform(args: AccountCreateArgs) {
        const accountWithLogin = await this.queryRepository.findByLogin(args.login)

        if (accountWithLogin) {
            throw Result.failure({ title: 'Create Account', message: `Already exists account with login "${args.login}"` }, HttpStatusCodes.BAD_REQUEST)
        }

        const response = await this.createRepository.perform(args)

        return response
    }
}
