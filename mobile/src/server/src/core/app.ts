import { LoggerService } from '../services/logger'
import { Controller } from '../common/controller'
import { Module } from '../common/module'
import { Service } from '../common/service'
import { ListenerPublicClient } from '../services/http'
import { HttpEsliph } from '@esliph/util-node'

export class Application {
    private module: Module
    private logger: LoggerService

    constructor(module: new () => Module) {
        this.module = new module()
        this.logger = new LoggerService()
    }

    initComponents() {
        this.module.initComponents()
        this.initEvents()
    }

    private initEvents() {
        ListenerPublicClient.on<HttpEsliph.EventsRouter, 'error'>('error', args => {
            if (args.request.origem == 'TESTE') {
                return
            }

            this.logger.error(args, null, { context: `[${args.request.context}]` })
        })
    }

    useController(...controllers: (new () => Controller)[]) {
        controllers.map(controller => this.initController(controller))
    }

    useService(...services: (new () => Service)[]) {
        services.map(service => this.initService(service))
    }

    private initController(controller: new () => Controller) {
        new controller().initComponents()
    }

    private initService(service: new () => Service) {
        new service().initComponents()
    }
}
