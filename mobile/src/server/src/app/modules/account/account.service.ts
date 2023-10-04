import { AccountCreateArgs } from './use-case/create/index'
import { Service } from '../../../common/service'
import { AccountCreateUseCase } from './use-case/create'
import { AccountFindFirstArgs, AccountFindFirstUseCase } from './use-case/query/find-first'
import { AccountFindManyUseCase } from './use-case/query/find-many'

export class AccountService extends Service {
    private readonly createUseCase: AccountCreateUseCase
    private readonly queryFindOndeUseCase: AccountFindFirstUseCase
    private readonly queryAllUseCase: AccountFindManyUseCase

    constructor() {
        super()

        this.createUseCase = new AccountCreateUseCase()
        this.queryFindOndeUseCase = new AccountFindFirstUseCase()
        this.queryAllUseCase = new AccountFindManyUseCase()
    }

    initComponents() {}

    async create(args: AccountCreateArgs) {
        const response = await this.createUseCase.perform(args)

        return response
    }

    async queryById({ id }: AccountFindFirstArgs) {
        const response = await this.queryFindOndeUseCase.perform({ id })

        return response
    }

    async queryByLogin({ login }: AccountFindFirstArgs) {
        const response = await this.queryFindOndeUseCase.perform({ login })

        return response
    }

    async queryAll() {
        const response = await this.queryAllUseCase.perform()

        return response
    }
}
