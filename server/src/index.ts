import Fastify from 'fastify'
import { Bootstrap } from '@esliph/module'
import { Server } from '@esliph/http'
import { FastifyAdapter } from '@esliph/adapter-fastify'
import { getEnv } from '@util'
import { MainModule } from '@main.module'
import { DatabaseService } from '@services/database.service'

const PORT = getEnv<number>({ name: 'PORT', defaultValue: 8080 })

FastifyAdapter.loadInstance(Fastify())

const App = Bootstrap(
    MainModule,
    {
        log: { eventHttp: true, eventListener: true, load: true },
    }, [new FastifyAdapter()]
)

FastifyAdapter.instance.listen({ port: PORT }, (err: Error | null, address: string) => {
    if (err) {
        console.log(err)

        return process.exit(1)
    }

    Server.on('request/error', (args) => {
        console.log(args)
    })

    App.logger.log(`Server running on address ${address}`)
})

new DatabaseService().instance.$on('error', args => {
    App.logger.error(args)
})