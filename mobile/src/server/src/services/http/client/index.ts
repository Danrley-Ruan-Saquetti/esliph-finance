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

    initComponents() { }
}

@Inversion.Injectable('ListenerPublicClient')
export class ListenerPublicClient extends ListenerClient<ApplicationEventsPublic> {
    constructor() {
        super()
        this.use({ access: EVENT_CONTEXT.PUBLIC })
    }
}

@Inversion.Injectable('ListenerPrivateClient')
export class ListenerPrivateClient extends ListenerClient<ApplicationEventsPrivate> {
    constructor() {
        super()
        this.use({ access: EVENT_CONTEXT.PRIVATE })
    }
}

@Inversion.Injectable('ListenerRepositoryClient')
export class ListenerRepositoryClient extends ListenerClient<ApplicationEventsDatabase> {
    constructor() {
        super()
        this.use({ access: EVENT_CONTEXT.DATABASE })
    }
}
