import { LoggerService } from '../services/logger'
import { Controller } from '../common/controller'
import { Module } from '../common/module'
import { Service } from '../common/service'
import { ListenerPublicClient } from '../services/http'
import { HttpEsliph } from '@esliph/util-node'

export enum ENV {
    Production = 'Production',
    Development = 'Development',
    Test = 'Test'
}

export class Application {
    private module: Module
    private logger: LoggerService

    constructor(module: new () => Module, private readonly env = ENV.Production) {
        this.module = new module()
        this.logger = new LoggerService('[Server]')
    }

    initComponents() {
        // this.logger.log('Initialization components...')

        this.module.initComponents()
        this.initEvents()

        // this.logger.log('Server started')
    }

    private initEvents() {
        ListenerPublicClient.on<HttpEsliph.EventsRouter, 'request/error'>('request/error', args => {
            // this.logger.error(args, null, { context: args.request.context ? `[${args.request.context}]` : '' })
        })
        ListenerPublicClient.on<HttpEsliph.EventsRouter, 'request/end'>('request/end', args => {
            // this.logger.log(args, null, { context: args.request.context ? `[${args.request.context}]` : '' })
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
