import { CategorySchema } from './category.schema'
import { CategoryCreateRepositoryResponse } from './repository/create'
import { CategoryCreateArgs, CategoryCreateResponse } from './use-case/create'

export type CategoryPublicEvents = {
    'POST': {
        'categories/create': {
            body: CategoryCreateArgs
            response: CategoryCreateResponse
        }
    }
    'GET': {}
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
        'categories/create': {
            body: CategorySchema,
            response: CategoryCreateRepositoryResponse
        }
    }
    'GET': {}
    'PUT': {}
    'PATCH': {}
    'DELETE': {}
    'HEAD': {}
    'OPTIONS': {}
}
