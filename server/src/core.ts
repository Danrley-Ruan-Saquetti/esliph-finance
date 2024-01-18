import { ControllerConfig } from '@esliph/module'

export * from '@esliph/http'
export * from '@esliph/adapter-fastify'
export * from '@esliph/common'
export * from '@esliph/console'
export * from '@esliph/decorator'
export * from '@esliph/injection'
export * from '@esliph/job'
export { Bootstrap as BootstrapJob } from '@esliph/job'
export * from '@esliph/metadata'
export * from '@esliph/observer'
export {
    ApplicationModule,
    ApplicationOptions,
    Bootstrap,
    BootstrapOptions,
    ControllerConfig,
    Delete,
    Emitter,
    Filter,
    FilterConfig,
    FilterPerform,
    Get,
    Guard,
    GuardConfig,
    Head,
    HttpStatusCode,
    Listener,
    Logger,
    Module,
    ModuleConfig,
    Options,
    Patch,
    Post,
    Put,
    Service,
    ServiceConfig
} from '@esliph/module'

import { Controller as ControllerModule } from '@esliph/module'

export enum Domain {
    CUSTOMER = '/customer',
    ADMIN = '/admin',
}

export function Controller(options?: ControllerConfig & { domain?: Domain }) {
    const prefix = (options?.domain || '' as string) + (options?.prefix || '')

    return ControllerModule({ ...options, prefix: prefix })
}