import Fastify, { FastifyRequest } from 'fastify'
import fastifyCsrf from '@fastify/csrf-protection'
import fastifyHelmet from '@fastify/helmet'
import fastifyCompression from '@fastify/compress'
import fastifyCookie from '@fastify/cookie'
import { ApplicationModule, Service } from '@esliph/module'
import { EventsRouter, Server } from '@esliph/http'
import { FastifyAdapter } from '@esliph/adapter-fastify'
import { GLOBAL_LOG_CONFIG } from '@global'
import { getEnv } from '@util'
import { WriteStreamOutput } from '@services/write-stream-output.service'
import { Result } from '@esliph/common'

export * from '@esliph/adapter-fastify'

const PORT = getEnv<number>({ name: 'PORT', defaultValue: 8080 })

@Service({ name: 'global.service.http' })
export class HttpService extends FastifyAdapter {

    static onLoad() {
        HttpService.loadInstance(Fastify())

        HttpService.instance.register(fastifyCompression, { encodings: ['gzip', 'deflate'] })
        HttpService.instance.register(fastifyCookie, { secret: 'my-secret' })
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
        const writer = WriteStreamOutput.newInstance(`${GLOBAL_LOG_CONFIG.path}/http.log`)

        HttpService.instance.listen({ port }, (err: Error | null, address: string) => {
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
