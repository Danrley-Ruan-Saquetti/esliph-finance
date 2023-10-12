import { ModelSchema } from '@esliph/util-node'
import { AccountSchema } from '../account.schema'

export class AccountRepository extends ModelSchema<AccountSchema> {
    constructor() {
        super('Account')
    }
}