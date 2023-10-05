import { ApplicationModulesEventsPublic, ApplicationModulesEventsDatabase, ApplicationModulesEventsPrivate } from '../../app/app.events'

export type ApplicationEvents = {
    'PUBLIC': ApplicationModulesEventsPublic
    'PRIVATE': ApplicationModulesEventsPrivate
    'DATABASE': ApplicationModulesEventsDatabase
}

export const EVENT_CONTEXT = {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE',
    DATABASE: 'DATABASE',
} as const
