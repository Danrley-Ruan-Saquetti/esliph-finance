import { AccountSchema } from './account.schema'
import { AccountCreateArgs, AccountCreateResponse } from './use-case/create'
import { AccountQueryArgs, AccountQueryResponse } from './use-case/query/find-first'
import { AccountCreateRepositoryResponse } from './repository/create'
import { AccountQueryRepositoryByName, AccountQueryRepositoryByLogin, AccountQueryRepositoryResponse, AccountQueryRepositoryById } from './repository/query'

export type AccountPublicEvents = {
    'POST': {
        'accounts/create': {
            body: AccountCreateArgs
            response: AccountCreateResponse
        }
    }
    'GET': {
        'accounts/find?id': {
            body: AccountQueryArgs
            response: AccountQueryResponse
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
        'accounts/find?id': {
            body: AccountQueryRepositoryById
            response: AccountQueryRepositoryResponse
        }
    }
}
