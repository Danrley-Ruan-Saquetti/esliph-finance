import { Controller } from '../common/controller'
import { Module } from '../common/module'
import { Service } from '../common/service'

export class Application {
    private module: Module

    constructor(module: new () => Module) {
        this.module = new module()
    }

    initComponents() {
        this.module.initComponents()
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