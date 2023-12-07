import { Bootstrap } from '@esliph/module'
import { FastifyAdapter } from '@esliph/adapter-fastify'
import { MainModule } from '@main.module'
import { getEnv } from '@util'

Bootstrap(MainModule, {
    log: { eventHttp: true, eventListener: true, load: true },
    adapters: [new FastifyAdapter()],
    port: getEnv<number>({ name: 'PORT', defaultValue: 8080 }),
})
