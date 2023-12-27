import Fastify from 'fastify'
import { ApplicationModule, Service } from '@esliph/module'
import { EventsRouter, Server } from '@esliph/http'
import { FastifyAdapter } from '@esliph/adapter-fastify'
import { GLOBAL_LOG_CONFIG } from '@global'
import { WriteStreamOutput } from '@services/write-stream-output.service'

export * from '@esliph/adapter-fastify'

@Service({ name: 'global.service.http' })
export class HttpService extends FastifyAdapter {

    static onLoad() {
        HttpService.loadInstance(Fastify())
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