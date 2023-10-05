import { AuthLoginArgs, AuthLoginResponse } from './use-case/login'
import { AuthAuthenticationArgs, AuthAuthenticationResponse } from './use-case/authentication'

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
        'auth/authentication': {
            body: AuthAuthenticationArgs
            response: AuthAuthenticationResponse
        }
    }
}
export type AuthDatabaseEvents = {}
