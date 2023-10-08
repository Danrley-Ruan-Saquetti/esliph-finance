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
import { AccountUpdateArgs, AccountUpdateResponse } from './use-case/update'
import { AccountUpdateRepositoryArgs, AccountUpdateRepositoryResponse } from './repository/update'

export type AccountPublicEvents = {
    'POST': {
        '@:accounts/create': {
            body: AccountCreateArgs
            response: AccountCreateResponse
        }
    }
    'GET': {
        '@:accounts/find?id': {
            body: { id: number }
            response: AccountFindFirstResponse
        }
        '@:accounts/find?login': {
            body: { login: string }
            response: AccountFindFirstResponse
        }
        '@:accounts/find-all': {
            body: AccountFindManyArgs
            response: AccountFindManyResponse
        }
    }
    'PUT': {
        '@:accounts/update': {
            body: AccountUpdateArgs
            response: AccountUpdateResponse
        }
    }
    'PATCH': {}
    'DELETE': {}
    'HEAD': {}
    'OPTIONS': {}
}

export type AccountPrivateEvents = {
    'POST': {}
    'GET': {}
    'PUT': {}
    'PATCH': {}
    'DELETE': {}
    'HEAD': {}
    'OPTIONS': {}
}
export type AccountDatabaseEvents = {
    'POST': {
        'db:accounts/create': {
            body: AccountSchema
            response: AccountCreateRepositoryResponse
        }
    }
    'GET': {
        'db:accounts/find?name': {
            body: AccountQueryByNameRepository
            response: AccountQueryOneRepositoryResponse
        }
        'db:accounts/find?login': {
            body: AccountQueryByLoginRepository
            response: AccountQueryOneRepositoryResponse
        }
        'db:accounts/find?id': {
            body: AccountQueryByIdRepository
            response: AccountQueryOneRepositoryResponse
        }
        'db:accounts/find-all': {
            body: AccountQueryAllRepository
            response: AccountQueryAllRepositoryResponse
        }
    }
    'PUT': {
        'db:accounts/update': {
            body: AccountUpdateRepositoryArgs
            response: AccountUpdateRepositoryResponse
        }
    }
    'PATCH': {}
    'DELETE': {}
    'HEAD': {}
    'OPTIONS': {}
}
