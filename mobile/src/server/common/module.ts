import { Inversion } from '../core/injection'
import { Controller } from './controller'
import { Service } from './service'

export interface ModuleArgs {
    controllers: (new (...args: any[]) => Controller)[]
    services: (new (...args: any[]) => Service)[]
    imports: (new () => Module)[]
}

export class Module {
    protected controllers: (new (...args: any[]) => Controller)[]
    protected services: (new (...args: any[]) => Service)[]
    protected imports: (new () => Module)[]

    constructor({ controllers = [], services = [], imports = [] }: Partial<ModuleArgs> = {}) {
        this.controllers = controllers
        this.services = services
        this.imports = imports
    }

    initComponents() {
        // @ts-expect-error
        this.services.map(instance => instance.initComponents && instance.initComponents())
        this.imports.map(instance => new instance().initComponents())
        // this.services.map(instance => Inversion.resolve(instance).initComponents())
        // this.controllers.map(instance => Inversion.resolve(instance).initComponents())
    }
}
