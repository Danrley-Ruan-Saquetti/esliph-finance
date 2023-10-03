import { AccountCreateArgs } from './use-case/create/index'
import { Service } from '../../../common/service'
import { AccountCreateUseCase } from './use-case/create'

export class AccountService extends Service {
    private readonly createUseCase: AccountCreateUseCase

    constructor() {
        super()

        this.createUseCase = new AccountCreateUseCase()
    }

    initComponents() { }

    async create(args: AccountCreateArgs) {
        const response = await this.createUseCase.perform(args)

        return response
    }
}