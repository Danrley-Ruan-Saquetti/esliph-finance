import Fastify from 'fastify'
import fastifyCsrf from '@fastify/csrf-protection'
import fastifyCors from '@fastify/cors'
import fastifyCookie from '@fastify/cookie'
import fastifyHelmet from '@fastify/helmet'
import FastifyMultipart from '@fastify/multipart'
import fastifyCompression from '@fastify/compress'
import { Result } from '@esliph/common'
import { ClassConstructor } from '@esliph/metadata'
import { ENV } from '@env'
import { StatusCode } from '@enums/http'
import { isClass, isInstance, isUndefined } from '@util/types'
import type { Request, Response } from '@@types/http'
import { Exception } from '@exceptions/exception'
import { ServerInternalErrorException } from '@exceptions/server-internal-error'
import { getControllerMetadata } from '@server/components/controller'
import { GuardConfig, getGuardMetadata } from '@server/components/guard'
import { RouterConfig, getRoutersFromController } from '@server/components/router'
import { Provider, getModuleMetadata, isModuleMetadata } from '@server/components/module'

type ModuleConfigHierarchy = {
    imports: ModuleConfigHierarchy[]
    controllers: ClassConstructor[]
    providers: Provider[]
}

type RouterHandler = RouterConfig & { controller: any, handlerName: string, guards: GuardConfig }

type ModuleServer = {
    controllers: ClassConstructor[]
    providers: Provider[]
    routers: RouterHandler[]
}

type ProviderSetting = { prefix: string }

export class Server {
    private readonly app = Fastify()
    private moduleServer: ModuleServer = { controllers: [], providers: [], routers: [] }

    getControllers() {
        return this.moduleServer.controllers
    }

    getProviders() {
        return this.moduleServer.providers
    }

    getRouters() {
        return this.moduleServer.routers
    }

    async Bootstrap(module: ClassConstructor) {
        await this.initialize()
        await this.initModule(module)
        await this.listen()
    }

    private async initialize() {
        await this.app.register(fastifyCompression, { encodings: ['gzip', 'deflate'] })
        await this.app.register(fastifyCookie, { secret: ENV.SERVER_KEY })
        await this.app.register(fastifyCsrf)
        await this.app.register(FastifyMultipart)
        await this.app.register(fastifyHelmet)
        await this.app.register(fastifyCors)

        this.app.setNotFoundHandler((request, reply) => {
            const result = Result.failure({ title: 'Router Not Found', message: `Router ${request.method} "${request.url}" not found` }, StatusCode.NOT_FOUND)

            reply.status(result.getStatus()).send(result.getResponse())
        })
    }

    private async initModule(module: ClassConstructor) {
        const configModule = this.getModuleConfigHierarchy(module)

        const moduleSetup = await Server.loadModule(configModule)

        this.moduleServer.controllers.push(...moduleSetup.controllers)
        this.moduleServer.providers.push(...moduleSetup.providers)
        this.moduleServer.routers.push(...moduleSetup.routers)

        this.initRouters(moduleSetup.routers)
        await this.afterLoad()
    }

    private static async loadModule(configModule: ModuleConfigHierarchy, providersSettings: ProviderSetting = { prefix: '' }) {
        providersSettings = await Server.initProviders(configModule.providers, providersSettings)
        const routers = Server.getRoutersFromControllers(configModule.controllers, providersSettings)

        for (let i = 0; i < configModule.imports.length; i++) {
            const { controllers, providers, routers: routersModule } = await this.loadModule(configModule.imports[i], providersSettings)

            configModule.controllers.push(...controllers)
            configModule.providers.push(...providers)
            routers.push(...routersModule)
        }

        return { controllers: configModule.controllers, providers: configModule.providers, routers }
    }

    private getModuleConfigHierarchy(module: ClassConstructor): ModuleConfigHierarchy {
        if (!isModuleMetadata(module))
            throw new Exception({ message: `Module "${module.name}" must need decorator @Module` })

        const { imports: moduleImports, controllers, providers } = getModuleMetadata(module)

        return {
            controllers,
            providers,
            imports: moduleImports.map(importModule => {
                if ((importModule as any).init)
                    (importModule as any).init()

                return this.getModuleConfigHierarchy(importModule)
            }),
        }
    }

    private static async initProviders(providers: any[], providersSettings: ProviderSetting = { prefix: '' }) {
        for (let i = 0; i < providers.length; i++) {
            const provider = providers[i]

            if (isClass(provider)) {
                if ((provider as any).init)
                    (provider as any).init()

                const instance = new provider()

                if (instance?.init)
                    instance.init()

                continue
            }

            if (provider.prefix)
                providersSettings.prefix += provider.prefix
        }

        return providersSettings
    }

    private static getRoutersFromControllers(controllers: ClassConstructor[], providersSettings: ProviderSetting = { prefix: '' }) {
        const routers: RouterHandler[] = []

        for (let i = 0; i < controllers.length; i++) {
            const routersController = getRoutersFromController(controllers[i])
            const controllerConfig = getControllerMetadata(controllers[i])

            routers.push(...routersController.map(routerConfig => {
                const { filters = [] } = getGuardMetadata(controllers[i], routerConfig.methodName) || {}

                if (controllerConfig?.prefix)
                    routerConfig.path = `${controllerConfig.prefix}/${routerConfig.path}`

                if (providersSettings.prefix)
                    routerConfig.path = `${providersSettings.prefix}/${routerConfig.path}`

                routerConfig.path = '/' + routerConfig.path
                    .replace(/\/\//g, '/')
                    .replace(/^\/|\/$/g, '')
                    .replace(' ', '')

                return {
                    method: routerConfig.method,
                    handlerName: routerConfig.methodName,
                    path: routerConfig.path,
                    controller: controllers[i],
                    guards: { filters }
                }
            }))
        }

        return routers
    }

    private initRouters(routers: RouterHandler[]) {
        for (let i = 0; i < routers.length; i++) {
            const { controller: controllerInstance, path, method, handlerName, guards } = routers[i]

            const handlers: ((req: Request, res: Response) => Promise<any | void>)[] = []

            for (let i = 0; i < guards.filters.length; i++) {
                handlers.push(async function (req: Request, res: Response) {
                    const filter = new guards.filters[i]()
                    const result = await filter.perform(req, res)

                    return result
                })
            }

            handlers.push(async (req: Request, res: Response) => {
                const controller = new controllerInstance()
                let result = await controller[handlerName](req, res)

                return result
            })

            async function handler(req: Request, res: Response) {
                let result: any

                if (!req.body)
                    req.body = {}

                try {
                    for (let i = 0; i < handlers.length; i++) {
                        result = await handlers[i](req, res)

                        if (result instanceof Result && !result.isSuccess())
                            break
                    }
                } catch (err: any) {
                    if (err instanceof Exception)
                        result = Result.failure({ title: 'Error', ...err.getError() }, err.getStatus())
                    else
                        result = new ServerInternalErrorException({ ...err, message: err.message, stack: '' })
                }

                if (result instanceof Result) {
                    res.status(result.getStatus())

                    if (result.getValue() instanceof ArrayBuffer)
                        return res.send(result.getValue())

                    return res.send(result.getResponse())
                }

                if (result instanceof Exception)
                    return res
                        .status(result.getStatus())
                        .send({ ...Result.failure({ title: 'Error', ...result.getError() }, result.getStatus()).getResponse(), stack: undefined })

                if (result instanceof Error)
                    return res
                        .status(StatusCode.BAD_REQUEST)
                        .send({ ...Result.failure({ title: 'Error', ...result }, StatusCode.BAD_REQUEST).getResponse(), stack: undefined })

                if (!isUndefined(result))
                    return res.send(Result.success(result))
            }

            this.app[method.toLocaleLowerCase()](path, handler)
        }
    }

    private async afterLoad() {
        for (let i = 0; i < this.moduleServer.providers.length; i++) {
            if (!isInstance(this.moduleServer.providers[i]))
                continue

            if ((this.moduleServer.providers[i] as any).afterLoad)
                await (this.moduleServer.providers[i] as any).afterLoad()
        }
    }

    private async listen() {
        try {
            const address = await this.app.listen({ port: ENV.PORT })

            console.log(`Server running on address: "${address}"`)
        } catch (err: any) {
            if (err) {
                console.log(err)
                process.exit(1)
            }
        }
    }
}