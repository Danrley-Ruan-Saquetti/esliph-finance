import { Client } from '@esliph/util-node'
import { EventsModel } from '@esliph/util-node/dist/lib/http/controller/model'
import { Service } from '../../../common/service'
import { EVENT_CONTEXT, ApplicationEventsDatabase, ApplicationEventsPrivate, ApplicationEventsPublic } from '../events'

class ListenerClient<Events extends EventsModel> extends Client<Events> implements Service {
    constructor() {
        super()
    }

    initComponents() {}
}

export class ListenerPublicClient extends ListenerClient<ApplicationEventsPublic> {
    constructor() {
        super()
        this.use({ access: EVENT_CONTEXT.PUBLIC, context: `Client:${EVENT_CONTEXT.PUBLIC}` })
    }
}

export class ListenerPrivateClient extends ListenerClient<ApplicationEventsPrivate> {
    constructor() {
        super()
        this.use({ access: EVENT_CONTEXT.PRIVATE, context: `Client:${EVENT_CONTEXT.PRIVATE}` })
    }
}

export class ListenerRepositoryClient extends ListenerClient<ApplicationEventsDatabase> {
    constructor() {
        super()
        this.use({ access: EVENT_CONTEXT.DATABASE, context: `Client:${EVENT_CONTEXT.DATABASE}` })
    }
}
