import { Bootstrap } from '@esliph/module'
import { FastifyAdapter } from '@esliph/adapter-fastify'
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

FastifyAdapter.instance.listen({ port: PORT }, () => {
    app.logger.log(`Server runing in port ${PORT}`)
})
