import { ApplicationModulesEventsPublic, ApplicationModulesEventsDatabase, ApplicationModulesEventsPrivate } from '../../app/app.events'

export type ApplicationEventsPublic = ApplicationModulesEventsPublic
export type ApplicationEventsPrivate = ApplicationModulesEventsPrivate
export type ApplicationEventsDatabase = ApplicationModulesEventsDatabase

export const EVENT_CONTEXT = {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE',
    DATABASE: 'DATABASE',
} as const
