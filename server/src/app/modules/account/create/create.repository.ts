import { ModelSchema, Result } from '@esliph/util-node'
import { AccountModel, AccountArgs } from '../account.schema'

export abstract class AccountCreateRepositoryAbstract {
    abstract perform(args: AccountArgs): Result<AccountModel>
}

export class AccountCreateRepository extends ModelSchema<AccountArgs> implements AccountCreateRepositoryAbstract {
    constructor(isolated = true) {
        super('Account', { isolated })
    }

    perform(args: AccountArgs): Result<AccountModel> {
        return Result.success(this.create({ data: { ...args } }))
    }
}
