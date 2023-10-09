import { Server } from '@esliph/util-node'
import { EventsModel } from '@esliph/util-node/dist/lib/http/controller/model'
import { Service } from '../../../common/service'
import { Inversion } from '../../../core/injection'
import { EVENT_CONTEXT, ApplicationEventsDatabase, ApplicationEventsPrivate, ApplicationEventsPublic } from '../events'

@Inversion.Injectable()
class ListenerServer<Events extends EventsModel> extends Server<Events> implements Service {
    constructor() {
        super()
    }

    initComponents() {}
}

@Inversion.Injectable()
export class ListenerPublicServer extends ListenerServer<ApplicationEventsPublic> {
    constructor() {
        super()
        this.use({ access: EVENT_CONTEXT.PUBLIC })
    }

    static initComponents() {
        Inversion.container.bind('ListenerPublicServer').to(ListenerPublicServer)
    }
}

@Inversion.Injectable()
export class ListenerPrivateServer extends ListenerServer<ApplicationEventsPrivate> {
    constructor() {
        super()
        this.use({ access: EVENT_CONTEXT.PRIVATE })
    }

    static initComponents() {
        Inversion.container.bind('ListenerPrivateServer').to(ListenerPrivateServer)
    }
}

@Inversion.Injectable()
export class ListenerRepositoryServer extends ListenerServer<ApplicationEventsDatabase> {
    constructor() {
        super()
        this.use({ access: EVENT_CONTEXT.DATABASE })
    }

    static initComponents() {
        Inversion.container.bind('ListenerRepositoryServer').to(ListenerRepositoryServer)
    }
}
