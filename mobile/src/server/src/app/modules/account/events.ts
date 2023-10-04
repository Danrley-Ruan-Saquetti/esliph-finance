import { Document } from '@esliph/util-node/dist/lib/repository-memory'
import { AccountSchema } from './account.schema'
import { AccountCreateArgs, AccountCreateResponse } from './use-case/create'

export type AccountPublicEvents = {
    'POST': {
        'accounts/create': {
            body: AccountCreateArgs
            response: AccountCreateResponse
        }
    }
}
export type AccountDatabaseEvents = {
    'POST': {
        'accounts/create': {
            body: AccountSchema
            response: Document<AccountSchema>
        }
    }
}
