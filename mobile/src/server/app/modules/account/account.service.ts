import { AccountCreateArgs } from './use-case/create/index'
import { Service } from '../../../common/service'
import { AccountCreateUseCase } from './use-case/create'
import { AccountFindFirstArgs, AccountFindFirstUseCase } from './use-case/query/find-first'
import { AccountFindManyUseCase } from './use-case/query/find-many'
import { AccountUpdateUseCase, AccountUpdateArgs, AccountUpdateArgsHeader } from './use-case/update'
import { Inversion } from '../../../core/injection'

@Inversion.Injectable('AccountService')
export class AccountService extends Service {
    constructor(
        @Inversion.Inject('AccountCreateUseCase') private readonly createUseCase: AccountCreateUseCase,
        @Inversion.Inject('AccountUpdateUseCase') private readonly updateUseCase: AccountUpdateUseCase,
        @Inversion.Inject('AccountFindFirstUseCase') private readonly queryFindOndeUseCase: AccountFindFirstUseCase,
        @Inversion.Inject('AccountFindManyUseCase') private readonly queryAllUseCase: AccountFindManyUseCase,
    ) {
        super()
    }

    async create(args: AccountCreateArgs) {
        const response = await this.createUseCase.perform(args)

        return response
    }

    async update(args: AccountUpdateArgs & AccountUpdateArgsHeader) {
        const response = await this.updateUseCase.perform(args)

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
