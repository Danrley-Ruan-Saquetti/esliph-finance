import { Client, HttpEsliph } from '@esliph/util-node'
import { EVENT_CONTEXT, ApplicationEventsDatabase, ApplicationEventsPrivate, ApplicationEventsPublic } from '../events'

export class ListenerPublicClient extends Client<ApplicationEventsPublic> {
    constructor(options?: Partial<Omit<HttpEsliph.RequestOption, 'access'>>) {
        super({ ...options, access: EVENT_CONTEXT.PUBLIC })
    }
}
export class ListenerPrivateClient extends Client<ApplicationEventsPrivate> {
    constructor(options?: Partial<Omit<HttpEsliph.RequestOption, 'access'>>) {
        super({ ...options, access: EVENT_CONTEXT.PRIVATE })
    }
}
export class ListenerRepositoryClient extends Client<ApplicationEventsDatabase> {
    constructor(options?: Partial<Omit<HttpEsliph.RequestOption, 'access'>>) {
        super({ ...options, access: EVENT_CONTEXT.DATABASE })
    }
}
