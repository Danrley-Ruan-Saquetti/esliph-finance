import { Client, HttpEsliph } from '@esliph/util-node'
import { ApplicationEvents, EVENT_CONTEXT } from '../events'

class ApplicationClient<Context extends keyof ApplicationEvents> extends Client<ApplicationEvents, Context> {
    constructor(context: Context, requestOptions?: Partial<HttpEsliph.RequestOption>) {
        super(context, requestOptions)
    }
}

export class ListenerPublicClient extends ApplicationClient<typeof EVENT_CONTEXT.PUBLIC> {
    constructor(requestOptions?: Partial<HttpEsliph.RequestOption>) {
        super(EVENT_CONTEXT.PUBLIC, requestOptions)
    }
}
export class ListenerPrivateClient extends ApplicationClient<typeof EVENT_CONTEXT.PRIVATE> {
    constructor(requestOptions?: Partial<HttpEsliph.RequestOption>) {
        super(EVENT_CONTEXT.PRIVATE, requestOptions)
    }
}
export class ListenerRepositoryClient extends ApplicationClient<typeof EVENT_CONTEXT.DATABASE> {
    constructor(requestOptions?: Partial<HttpEsliph.RequestOption>) {
        super(EVENT_CONTEXT.DATABASE, requestOptions)
    }
}
