import { ObserverListener, Service } from '@core'

@Service({ name: 'global.service.listener-event' })
export class ListenerEventService extends ObserverListener {
    constructor() {
        super()
    }
}