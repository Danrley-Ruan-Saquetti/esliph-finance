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

    initComponents() { }
}

@Inversion.Injectable('ListenerPublicServer')
export class ListenerPublicServer extends ListenerServer<ApplicationEventsPublic> {
    constructor() {
        super()
        this.use({ access: EVENT_CONTEXT.PUBLIC })
    }
}

@Inversion.Injectable('ListenerPrivateServer')
export class ListenerPrivateServer extends ListenerServer<ApplicationEventsPrivate> {
    constructor() {
        super()
        this.use({ access: EVENT_CONTEXT.PRIVATE })
    }
}

@Inversion.Injectable('ListenerRepositoryServer')
export class ListenerRepositoryServer extends ListenerServer<ApplicationEventsDatabase> {
    constructor() {
        super()
        this.use({ access: EVENT_CONTEXT.DATABASE })
    }
}
