import { EventsRouter } from '@esliph/util-node/dist/lib/http/server/events'
import { Controller } from '../common/controller'
import { Module } from '../common/module'
import { Service } from '../common/service'
import { ListenerPublicClient } from '../services/http'

export class Application {
    private module: Module

    constructor(module: new () => Module) {
        this.module = new module()
    }

    initComponents() {
        this.module.initComponents()
        ListenerPublicClient.on<EventsRouter, 'error'>('error', (args) => {
            console.log(args)
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