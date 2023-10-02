import { ListenerPublicServer } from '../services/http'

export abstract class ControllerAbstract {
    abstract initComponents(): void
}

export class Controller implements ControllerAbstract {
    protected readonly observer: ListenerPublicServer

    constructor() {
        this.observer = new ListenerPublicServer()
    }

    initComponents() {
        throw new Error('Method not implemented.')
    }
}
