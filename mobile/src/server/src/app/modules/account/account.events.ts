import { AccountSchema } from './account.schema'
import { AccountCreateArgs, AccountCreateResponse } from './use-case/create'
import { AccountCreateRepositoryResponse } from './repository/create'
import { AccountQueryRepositoryByName, AccountQueryRepositoryByLogin, AccountQueryRepositoryResponse } from './repository/query'

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
            response: AccountCreateRepositoryResponse
        }
    }
    'GET': {
        'accounts/find?name': {
            body: AccountQueryRepositoryByName
            response: AccountQueryRepositoryResponse
        }
        'accounts/find?login': {
            body: AccountQueryRepositoryByLogin
            response: AccountQueryRepositoryResponse
        }
    }
}
