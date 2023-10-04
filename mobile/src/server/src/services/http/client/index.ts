import { Client } from '@esliph/util-node'
import { ApplicationEvents, EVENT_CONTEXT } from '../events'

class ApplicationClient<Context extends keyof ApplicationEvents> extends Client<ApplicationEvents, Context> {
    constructor(context: Context) {
        super(context)
    }
}

export class ListenerPublicClient extends ApplicationClient<typeof EVENT_CONTEXT.PUBLIC> {
    constructor() {
        super(EVENT_CONTEXT.PUBLIC)
    }
}
export class ListenerRepositoryClient extends ApplicationClient<typeof EVENT_CONTEXT.DATABASE> {
    constructor() {
        super(EVENT_CONTEXT.DATABASE)
    }
}
