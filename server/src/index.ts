import { Bootstrap } from '@esliph/module'
import { FastifyAdapter } from '@esliph/adapter-fastify'
import { Server } from '@esliph/http'
import Fastify from 'fastify'
import { MainModule } from '@main.module'
import { getEnv } from '@util'

const PORT = getEnv<number>({ name: 'PORT', defaultValue: 8080 })

FastifyAdapter.loadInstance(Fastify())

const app = Bootstrap(
    MainModule,
    {
        log: { eventHttp: true, eventListener: true, load: true },
    },
    [new FastifyAdapter()],
)

FastifyAdapter.instance.listen({ port: PORT }, (err: Error | null, address: string) => {
    if (err) {
        console.log(err)

        return process.exit(1)
    }

    Server.on('request/error', (args) => {
        console.log(args)
    })

    app.logger.log(`Server running on address ${address}`)
})
