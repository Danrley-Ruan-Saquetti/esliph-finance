import { ApplicationServer } from '../services/http'
import { EVENT_CONTEXT } from '../services/http/events'

export abstract class ControllerAbstract {
    abstract initComponents(): void
}

export class Controller<Context extends keyof typeof EVENT_CONTEXT = typeof EVENT_CONTEXT.PUBLIC> implements ControllerAbstract {
    protected readonly observer: ApplicationServer<Context>

    constructor({ prefix = '', context = EVENT_CONTEXT.PUBLIC }: { prefix?: string; context?: EVENT_CONTEXT }) {
        this.observer = new ApplicationServer<Context>({ prefix, context: context as any })
    }

    initComponents() {
        throw new Error('Method not implemented.')
    }
}
