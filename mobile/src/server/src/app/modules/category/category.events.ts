import { CategorySchema } from './category.schema'
import { CategoryCreateRepositoryResponse } from './repository/create'
import { CategoryQueryAllRepository, CategoryQueryAllRepositoryResponse, CategoryQueryByIdRepository, CategoryQueryByNameRepository, CategoryQueryOneRepositoryResponse } from './repository/query'
import { CategoryCreateArgs, CategoryCreateResponse } from './use-case/create'
import { CategoryFindFirstResponse } from './use-case/query/find-first'
import { CategoryFindManyArgs, CategoryFindManyResponse } from './use-case/query/find-many'

export type CategoryPublicEvents = {
    'POST': {
        'PU:categories/create': {
            body: CategoryCreateArgs
            response: CategoryCreateResponse
        }
    }
    'GET': {
        'PU:categories/find?id': {
            body: { id: number }
            response: CategoryFindFirstResponse
        }
        'PU:categories/find?name': {
            body: { name: string }
            response: CategoryFindFirstResponse
        }
        'PU:categories/find-all': {
            body: CategoryFindManyArgs
            response: CategoryFindManyResponse
        }
    }
    'PUT': {}
    'PATCH': {}
    'DELETE': {}
    'HEAD': {}
    'OPTIONS': {}
}
export type CategoryPrivateEvents = {
    'POST': {}
    'GET': {}
    'PUT': {}
    'PATCH': {}
    'DELETE': {}
    'HEAD': {}
    'OPTIONS': {}
}
export type CategoryDatabaseEvents = {
    'POST': {
        'DB:categories/create': {
            body: CategorySchema,
            response: CategoryCreateRepositoryResponse
        }
    }
    'GET': {
        'DB:categories/find?id': {
            body: CategoryQueryByIdRepository,
            response: CategoryQueryOneRepositoryResponse
        }
        'DB:categories/find?name': {
            body: CategoryQueryByNameRepository,
            response: CategoryQueryOneRepositoryResponse
        }
        'DB:categories/find-all': {
            body: CategoryQueryAllRepository,
            response: CategoryQueryAllRepositoryResponse
        }
    }
    'PUT': {}
    'PATCH': {}
    'DELETE': {}
    'HEAD': {}
    'OPTIONS': {}
}
