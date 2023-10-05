import { AccountSchema } from './account.schema'
import { AccountCreateArgs, AccountCreateResponse } from './use-case/create'
import { AccountFindFirstArgs, AccountFindFirstResponse } from './use-case/query/find-first'
import { AccountFindManyArgs, AccountFindManyResponse } from './use-case/query/find-many'
import { AccountCreateRepositoryResponse } from './repository/create'
import {
    AccountQueryByNameRepository,
    AccountQueryByLoginRepository,
    AccountQueryOneRepositoryResponse,
    AccountQueryByIdRepository,
    AccountQueryAllRepository,
    AccountQueryAllRepositoryResponse,
} from './repository/query'

export type AccountPublicEvents = {
    'POST': {
        'accounts/create': {
            body: AccountCreateArgs
            response: AccountCreateResponse
        }
        'accounts/teste': {
            body: any
            response: any
        }
    }
    'GET': {
        'accounts/find?id': {
            body: { id: number }
            response: AccountFindFirstResponse
        }
        'accounts/find?login': {
            body: { login: string }
            response: AccountFindFirstResponse
        }
        'accounts/find-all': {
            body: AccountFindManyArgs
            response: AccountFindManyResponse
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
            body: AccountQueryByNameRepository
            response: AccountQueryOneRepositoryResponse
        }
        'accounts/find?login': {
            body: AccountQueryByLoginRepository
            response: AccountQueryOneRepositoryResponse
        }
        'accounts/find?id': {
            body: AccountQueryByIdRepository
            response: AccountQueryOneRepositoryResponse
        }
        'accounts/find-all': {
            body: AccountQueryAllRepository
            response: AccountQueryAllRepositoryResponse
        }
    }
}
