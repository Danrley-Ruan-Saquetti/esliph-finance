import { ObserverEmitter, Service } from '@core'

@Service({ name: 'global.service.emitter-event' })
export class EmitterEventService extends ObserverEmitter {
    constructor() {
        super()
    }
}