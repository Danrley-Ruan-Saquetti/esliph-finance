import { AuthPublicEvents, AuthDatabaseEvents, AuthPrivateEvents } from './modules/auth/auth.events'
import { AccountPublicEvents, AccountDatabaseEvents, AccountPrivateEvents } from './modules/account/account.events'
import { CategoryDatabaseEvents, CategoryPrivateEvents, CategoryPublicEvents } from './modules/category/category.events'

export type ApplicationModulesEventsPublic = AccountPublicEvents & AuthPublicEvents & CategoryPublicEvents
export type ApplicationModulesEventsPrivate = AuthPrivateEvents & AccountPrivateEvents & CategoryPrivateEvents
export type ApplicationModulesEventsDatabase = AccountDatabaseEvents & AuthDatabaseEvents & CategoryDatabaseEvents
