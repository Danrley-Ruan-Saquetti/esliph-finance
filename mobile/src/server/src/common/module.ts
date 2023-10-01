import { Controller } from './controller'
import { Service } from './service'

export interface ModuleArgs {
    controllers: (new () => Controller)[],
    services: (new () => Service)[]
}

export class Module {
    protected controllers: (new () => Controller)[]
    protected services: (new () => Service)[]

    constructor({ controllers = [], services = [] }: Partial<ModuleArgs>) {
        this.controllers = controllers
        this.services = services
    }

    getControllers() {
        return this.controllers
    }

    getServices() {
        return this.services
    }
}