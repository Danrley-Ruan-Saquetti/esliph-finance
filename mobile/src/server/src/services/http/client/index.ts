import { Client } from '@esliph/util-node'
import { EventsModel } from '@esliph/util-node/dist/lib/http/controller/model'
import { Service } from '../../../common/service'
import { Inversion } from '../../../core/injection'
import { EVENT_CONTEXT, ApplicationEventsDatabase, ApplicationEventsPrivate, ApplicationEventsPublic } from '../events'

@Inversion.Injectable()
class ListenerClient<Events extends EventsModel> extends Client<Events> implements Service {
    constructor() {
        super()
    }

    initComponents() {}
}

@Inversion.Injectable()
export class ListenerPublicClient extends ListenerClient<ApplicationEventsPublic> {
    constructor() {
        super()
        this.use({ access: EVENT_CONTEXT.PUBLIC })
    }

    static initComponents() {
        Inversion.container.bind('ListenerPublicClient').to(ListenerPublicClient)
    }
}

@Inversion.Injectable()
export class ListenerPrivateClient extends ListenerClient<ApplicationEventsPrivate> {
    constructor() {
        super()
        this.use({ access: EVENT_CONTEXT.PRIVATE })
    }

    static initComponents() {
        Inversion.container.bind('ListenerPrivateClient').to(ListenerPrivateClient)
    }
}

@Inversion.Injectable()
export class ListenerRepositoryClient extends ListenerClient<ApplicationEventsDatabase> {
    constructor() {
        super()
        this.use({ access: EVENT_CONTEXT.DATABASE })
    }

    static initComponents() {
        Inversion.container.bind('ListenerRepositoryClient').to(ListenerRepositoryClient)
    }
}
