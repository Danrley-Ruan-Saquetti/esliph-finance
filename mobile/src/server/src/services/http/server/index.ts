import { Server } from '@esliph/util-node'
import { EVENT_CONTEXT, ApplicationEventsDatabase, ApplicationEventsPrivate, ApplicationEventsPublic } from '../events'

export class ListenerPublicServer extends Server<ApplicationEventsPublic> {
    constructor(origin = '') {
        super({ context: EVENT_CONTEXT.PUBLIC, origin })
    }
}
export class ListenerPrivateServer extends Server<ApplicationEventsPrivate> {
    constructor(origin = '') {
        super({ context: EVENT_CONTEXT.PRIVATE, origin })
    }
}
export class ListenerRepositoryServer extends Server<ApplicationEventsDatabase> {
    constructor(origin = '') {
        super({ context: EVENT_CONTEXT.DATABASE, origin })
    }
}
