import { ApplicationModulesEventsPublic, ApplicationModulesEventsDatabase, ApplicationModulesEventsPrivate } from '../../app/app.events'

export type ApplicationEventsPublic = ApplicationModulesEventsPublic
export type ApplicationEventsPrivate = ApplicationModulesEventsPrivate
export type ApplicationEventsDatabase = ApplicationModulesEventsDatabase

export enum EVENT_CONTEXT {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
    DATABASE = 'DATABASE',
}

export const ROUTER_PREFIX = {
    PUBLIC: 'PU:',
    PRIVATE: 'PR:',
    DATABASE: 'DB:',
} as const

export type RouterPrefix = {
    PUBLIC: typeof ROUTER_PREFIX.PUBLIC,
    PRIVATE: typeof ROUTER_PREFIX.PRIVATE,
    DATABASE: typeof ROUTER_PREFIX.DATABASE,
}