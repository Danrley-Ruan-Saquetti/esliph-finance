import { Client, HttpEsliph } from '@esliph/util-node'
import { EVENT_CONTEXT, ApplicationEventsDatabase, ApplicationEventsPrivate, ApplicationEventsPublic } from '../events'

export class ListenerPublicClient extends Client<ApplicationEventsPublic> {
    constructor(options?: Omit<HttpEsliph.RequestOption, 'context'>) {
        super({ ...options, context: EVENT_CONTEXT.PUBLIC })
    }
}
export class ListenerPrivateClient extends Client<ApplicationEventsPrivate> {
    constructor(options?: Omit<HttpEsliph.RequestOption, 'context'>) {
        super({ ...options, context: EVENT_CONTEXT.PRIVATE })
    }
}
export class ListenerRepositoryClient extends Client<ApplicationEventsDatabase> {
    constructor(options?: Omit<HttpEsliph.RequestOption, 'context'>) {
        super({ ...options, context: EVENT_CONTEXT.DATABASE })
    }
}
