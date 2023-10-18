import { Server } from '@esliph/util-node'
import { EventsModel } from '@esliph/util-node/dist/lib/http/controller/model'
import { Service } from '../../../common/service'
import { EVENT_CONTEXT, ApplicationEventsDatabase, ApplicationEventsPrivate, ApplicationEventsPublic } from '../events'

class ListenerServer<Events extends EventsModel> extends Server<Events> implements Service {
    constructor() {
        super()
    }

    initComponents() {}
}

export class ListenerPublicServer extends ListenerServer<ApplicationEventsPublic> {
    constructor() {
        super()
        this.use({ access: EVENT_CONTEXT.PUBLIC, context: `Server:${EVENT_CONTEXT.PUBLIC}` })
    }
}

export class ListenerPrivateServer extends ListenerServer<ApplicationEventsPrivate> {
    constructor() {
        super()
        this.use({ access: EVENT_CONTEXT.PRIVATE, context: `Server:${EVENT_CONTEXT.PRIVATE}` })
    }
}

export class ListenerRepositoryServer extends ListenerServer<ApplicationEventsDatabase> {
    constructor() {
        super()
        this.use({ access: EVENT_CONTEXT.DATABASE, context: `Server:${EVENT_CONTEXT.DATABASE}` })
    }
}
