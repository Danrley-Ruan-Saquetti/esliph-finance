import { Bootstrap } from '@esliph/module'
import { FastifyAdapter } from '@esliph/adapter-fastify'
import { MainModule } from '@main.module'
import { RouterNotFoundException } from '@common/exceptions'
import { getEnv } from '@util'
import { errorCodes } from 'fastify'

const appAdapter = new FastifyAdapter()

FastifyAdapter.instance.setErrorHandler((error, request, reply) => {
    console.log(error)

    if (error instanceof errorCodes.FST_ERR_NOT_FOUND) {
        const errorException = new RouterNotFoundException({ message: `Router ${request.routeOptions.method.toUpperCase()} "${request.routeOptions.url}" not found` })

        reply.status(errorException.getStatus()).send(errorException.getError())
    }
})

Bootstrap(MainModule,
    {
        log: { eventHttp: true, eventListener: true, load: true },
        adapters: [appAdapter],
        port: getEnv<number>({ name: 'PORT', defaultValue: 8080 }),
    }
)
