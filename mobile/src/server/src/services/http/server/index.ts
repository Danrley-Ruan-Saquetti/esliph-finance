import { Server, HttpEsliph } from '@esliph/util-node'
import { EVENT_CONTEXT, ApplicationEventsDatabase, ApplicationEventsPrivate, ApplicationEventsPublic } from '../events'

export class ListenerPublicServer extends Server<ApplicationEventsPublic> {
    constructor(options?: Partial<Omit<HttpEsliph.ServerOption, 'access'>>) {
        super({ access: EVENT_CONTEXT.PUBLIC, ...options })
    }
}
export class ListenerPrivateServer extends Server<ApplicationEventsPrivate> {
    constructor(options?: Partial<Omit<HttpEsliph.ServerOption, 'access'>>) {
        super({ access: EVENT_CONTEXT.PRIVATE, ...options })
    }
}
export class ListenerRepositoryServer extends Server<ApplicationEventsDatabase> {
    constructor(options?: Partial<Omit<HttpEsliph.ServerOption, 'access'>>) {
        super({ access: EVENT_CONTEXT.DATABASE, ...options })
    }
}
