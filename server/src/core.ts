import { ControllerConfig } from '@esliph/module'

export * from '@esliph/http'
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
    Emitter,
    Filter,
    FilterConfig,
    FilterPerform,
    Guard,
    GuardConfig,
    HttpStatusCode,
    Listener,
    Logger,
    Module,
    ModuleConfig,
    Service,
    ServiceConfig
} from '@esliph/module'
export * as CoreModule from '@esliph/module'
export { Delete, Get, FastifyAdapter, Head, Options, Patch, Post, Put } from '@esliph/adapter-fastify'

import { Controller as ControllerModule } from '@esliph/module'

export enum Domain {
    CUSTOMER = '/customer',
    ADMIN = '/admin',
    PUBLIC = '/v1',
    LOCAL = '/local',
    DOCS = '/docs',
    BASE = ''
}

export function Controller(options?: ControllerConfig & { domain: Domain }) {
    const prefix = (options?.domain || '' as string) + (options?.prefix || '')

    return ControllerModule({ ...options, prefix: prefix })
}