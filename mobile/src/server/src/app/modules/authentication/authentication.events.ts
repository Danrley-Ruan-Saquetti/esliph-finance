import { AuthenticationLoginArgs, AuthenticationLoginResponse } from './use-case/login'

export type AuthenticationPublicEvents = {
    'POST': {
        'authentication/login': {
            body: AuthenticationLoginArgs,
            response: AuthenticationLoginResponse
        }
    }
}
export type AuthenticationDatabaseEvents = {}
