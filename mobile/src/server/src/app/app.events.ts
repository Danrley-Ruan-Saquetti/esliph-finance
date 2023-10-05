import { AuthenticationPublicEvents, AuthenticationDatabaseEvents } from './modules/authentication/authentication.events'
import { AccountPublicEvents, AccountDatabaseEvents } from './modules/account/account.events'

export type ApplicationModulesEventsPublic = AccountPublicEvents & AuthenticationPublicEvents
export type ApplicationModulesEventsDatabase = AccountDatabaseEvents & AuthenticationDatabaseEvents
