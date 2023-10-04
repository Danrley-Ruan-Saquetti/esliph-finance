import { AccountCreateArgs } from './use-case/create/index'
import { Service } from '../../../common/service'
import { AccountCreateUseCase } from './use-case/create'
import { AccountQueryArgs, AccountQueryUseCase } from './use-case/query/find-first'

export class AccountService extends Service {
    private readonly createUseCase: AccountCreateUseCase
    private readonly queryUseCase: AccountQueryUseCase

    constructor() {
        super()

        this.createUseCase = new AccountCreateUseCase()
        this.queryUseCase = new AccountQueryUseCase()
    }

    initComponents() {}

    async create(args: AccountCreateArgs) {
        const response = await this.createUseCase.perform(args)

        return response
    }

    async query(args: AccountQueryArgs) {
        const response = await this.queryUseCase.perform(args)

        return response
    }
}
