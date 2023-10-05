import { AuthLoginArgs, AuthLoginResponse } from './use-case/login'

export type AuthPublicEvents = {
    'POST': {
        'auth/login': {
            body: AuthLoginArgs
            response: AuthLoginResponse
        }
    }
}
export type AuthDatabaseEvents = {}
