import { Controller } from './controller'
import { Service } from './service'

export interface ModuleArgs {
    controllers: (new () => Controller)[],
    services: (new () => Service)[],
    imports: (new () => Module)[],
}

export class Module {
    protected controllers: (new () => Controller)[]
    protected services: (new () => Service)[]
    protected imports: (new () => Module)[]

    constructor({ controllers = [], services = [], imports = [] }: Partial<ModuleArgs>) {
        this.controllers = controllers
        this.services = services
        this.imports = imports
    }

    initComponents() {
        this.controllers.map(instance => new instance().initComponents())
        this.services.map(instance => new instance().initComponents())
        this.imports.map(instance => new instance().initComponents())
    }
}