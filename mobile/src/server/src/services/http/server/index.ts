import { Server, HttpEsliph } from '@esliph/util-node'
import { EVENT_CONTEXT, ApplicationEventsDatabase, ApplicationEventsPrivate, ApplicationEventsPublic } from '../events'

export class ListenerPublicServer extends Server<ApplicationEventsPublic> {
    constructor(options?: Omit<HttpEsliph.ServerOption, 'context'>) {
        super({ context: EVENT_CONTEXT.PUBLIC, ...options })
    }
}
export class ListenerPrivateServer extends Server<ApplicationEventsPrivate> {
    constructor(options?: Omit<HttpEsliph.ServerOption, 'context'>) {
        super({ context: EVENT_CONTEXT.PRIVATE, ...options })
    }
}
export class ListenerRepositoryServer extends Server<ApplicationEventsDatabase> {
    constructor(options?: Omit<HttpEsliph.ServerOption, 'context'>) {
        super({ context: EVENT_CONTEXT.DATABASE, ...options })
    }
}
