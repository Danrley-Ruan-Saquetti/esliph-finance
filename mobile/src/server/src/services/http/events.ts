import { ApplicationModulesEventsPublic, ApplicationModulesEventsDatabase } from '../../app/events'

export type ApplicationEvents = {
    'PUBLIC': ApplicationModulesEventsPublic
    'DATABASE': ApplicationModulesEventsDatabase
}

export const EVENT_CONTEXT = {
    PUBLIC: 'PUBLIC',
    DATABASE: 'DATABASE',
} as const
