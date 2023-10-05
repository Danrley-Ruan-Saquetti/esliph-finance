import { AuthPublicEvents, AuthDatabaseEvents } from './modules/auth/auth.events'
import { AccountPublicEvents, AccountDatabaseEvents } from './modules/account/account.events'

export type ApplicationModulesEventsPublic = AccountPublicEvents & AuthPublicEvents
export type ApplicationModulesEventsDatabase = AccountDatabaseEvents & AuthDatabaseEvents
