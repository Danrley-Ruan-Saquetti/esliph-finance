import Fastify, { FastifyRequest } from 'fastify'
import fastifyCompression from '@fastify/compress'
import fastifyCookie from '@fastify/cookie'
import fastifyHelmet from '@fastify/helmet'
import fastifyCsrf from '@fastify/csrf-protection'
import { ApplicationModule, Service } from '@core'
import { EventsRouter, Server } from '@core'
import { FastifyAdapter } from '@esliph/adapter-fastify'
import { Result } from '@core'
import { getEnv } from '@util'
import { GLOBAL_LOG_CONFIG, GLOBAL_SERVER } from '@global'
import { WriteStreamOutputService } from '@services/write-stream-output.service'

export { HttpStatusCode } from '@core'
export { HttpStatusCodes, Request, Response, ResultHttp, ResultHttpModel, Method } from '@core'
export * from '@esliph/adapter-fastify'

const PORT = getEnv<number>({ name: 'PORT', defaultValue: 8080 })

@Service({ name: 'global.service.http' })
export class HttpService extends FastifyAdapter {

    static onLoad() {
        HttpService.loadInstance(Fastify())

        HttpService.instance.register(fastifyCompression, { encodings: ['gzip', 'deflate'] })
        HttpService.instance.register(fastifyCookie, { secret: GLOBAL_SERVER.key })
        HttpService.instance.register(fastifyCsrf)
        HttpService.instance.register(fastifyHelmet)

        HttpService.instance.decorate('notFound', (request: FastifyRequest, reply) => {
            const result = Result.failure({ title: 'Router Not Found', message: `Router ${request.method} "${request.url}" not found` }, 404)

            reply.status(result.getStatus()).send(result.getResponse())
        })

        HttpService.instance.setNotFoundHandler(HttpService.instance['notFound'])
    }

    static onStart() {
        HttpService.listen({ port: PORT })
    }

    static listen({ port }: { port: number }) {
        const writer = WriteStreamOutputService.newInstance(`${GLOBAL_LOG_CONFIG.path}/http.log`)

        HttpService.instance.listen({ port, host: '0.0.0.0' }, (err: Error | null, address: string) => {
            if (err) {
                console.log(err)

                return process.exit(1)
            }

            Server.on('request/end', (args: EventsRouter['request/end']) => {
                const method = args.response.isSuccess() ? 'log' : 'error'
                const message = `${args.request.method} "${args.request.name}" ${args.response.getStatus()}`

                ApplicationModule.logger[method](message, null, { context: 'HTTP' })

                writer.write(JSON.stringify(args, null, 2))
                writer.write(message)
            })

            ApplicationModule.logger.log(`Server running on address ${address}`, {}, { context: 'HTTP' })
        })
    }
}
