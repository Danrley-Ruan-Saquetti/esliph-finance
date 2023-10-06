import { Client, HttpEsliph } from '@esliph/util-node'
import { EVENT_CONTEXT, ApplicationEventsDatabase, ApplicationEventsPrivate, ApplicationEventsPublic } from '../events'

export class ListenerPublicClient extends Client<ApplicationEventsPublic> {
    constructor(origin = '') {
        super({context: EVENT_CONTEXT.PUBLIC, origin})
    }
}
export class ListenerPrivateClient extends Client<ApplicationEventsPrivate> {
    constructor(origin = '') {
        super({context: EVENT_CONTEXT.PRIVATE, origin})
    }
}
export class ListenerRepositoryClient extends Client<ApplicationEventsDatabase> {
    constructor(origin = '') {
        super({context: EVENT_CONTEXT.DATABASE, origin})
    }
}
