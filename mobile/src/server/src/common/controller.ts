import { ApplicationServer } from '../services/http'

export abstract class ControllerAbstract {
    abstract initComponents(): void
}

export class Controller implements ControllerAbstract {
    protected readonly observer: ApplicationServer

    constructor(prefix?: string) {
        this.observer = new ApplicationServer(prefix)
    }

    initComponents() {
        throw new Error('Method not implemented.')
    }
}