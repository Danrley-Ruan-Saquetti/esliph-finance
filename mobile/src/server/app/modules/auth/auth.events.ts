import { AuthLoginArgs, AuthLoginResponse } from './use-case/login'
import { AuthAuthorizationArgs, AuthAuthorizationResponse } from './use-case/authorization'

export type AuthPublicEvents = {
    'POST': {
        'PU:auth/login': {
            body: AuthLoginArgs
            response: AuthLoginResponse
        }
        'PU:auth/valid-authorization': {
            body: any
            response: AuthAuthorizationResponse
        }
    }
    'GET': {}
    'PUT': {}
    'PATCH': {}
    'DELETE': {}
    'HEAD': {}
    'OPTIONS': {}
}
export type AuthPrivateEvents = {
    'POST': {
        'PR:auth/authorization': {
            body: any
            response: AuthAuthorizationResponse
        }
    }
    'GET': {}
    'PUT': {}
    'PATCH': {}
    'DELETE': {}
    'HEAD': {}
    'OPTIONS': {}
}
export type AuthDatabaseEvents = {
    'GET': {}
    'POST': {}
    'PUT': {}
    'PATCH': {}
    'DELETE': {}
    'HEAD': {}
    'OPTIONS': {}
}
