import { AuthLoginArgs, AuthLoginResponse } from './use-case/login'
import { AuthAuthorizationArgs, AuthAuthorizationResponse } from './use-case/authorization'

export type AuthPublicEvents = {
    'POST': {
        'auth/login': {
            body: AuthLoginArgs
            response: AuthLoginResponse
        }
    }
}
export type AuthPrivateEvents = {
    'POST': {
        'auth/authorization': {
            body: AuthAuthorizationArgs
            response: AuthAuthorizationResponse
        }
    }
}
export type AuthDatabaseEvents = {}
