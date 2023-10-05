import { Server } from '@esliph/util-node'
import { ApplicationEvents, EVENT_CONTEXT } from '../events'

class ApplicationServer<Context extends keyof ApplicationEvents> extends Server<ApplicationEvents, Context> {
    constructor(context: Context) {
        super(context)
    }
}

export class ListenerPublicServer extends ApplicationServer<typeof EVENT_CONTEXT.PUBLIC> {
    constructor() {
        super(EVENT_CONTEXT.PUBLIC)
    }
}
export class ListenerPrivateServer extends ApplicationServer<typeof EVENT_CONTEXT.PRIVATE> {
    constructor() {
        super(EVENT_CONTEXT.PRIVATE)
    }
}
export class ListenerRepositoryServer extends ApplicationServer<typeof EVENT_CONTEXT.DATABASE> {
    constructor() {
        super(EVENT_CONTEXT.DATABASE)
    }
}
