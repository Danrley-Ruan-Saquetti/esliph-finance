import { ModelSchema, Result } from '@esliph/util-node'
import { AccountModel, AccountArgs } from '../account.schema'

export abstract class AccountQueryRepositoryAbstract {
    abstract perform(): Result<AccountModel[]>
}

export class AccountQueryRepository extends ModelSchema<AccountArgs> implements AccountQueryRepositoryAbstract {
    constructor(isolated = true) {
        super('Account', { isolated })
    }

    perform(): Result<AccountModel[]> {
        return Result.success(this.findMany())
    }
}
