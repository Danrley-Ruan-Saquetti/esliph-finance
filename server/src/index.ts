import { Bootstrap } from '@esliph/module'
import { HttpService } from '@services/http.service'
import { getEnv } from '@util'
import { MainModule } from '@main.module'
import { Logger } from '@services/logger.service'

const PORT = getEnv<number>({ name: 'PORT', defaultValue: 8080 })

const App = Bootstrap(
    MainModule,
    {
        logger: new Logger(),
        log: { load: true, eventHttp: true }
    }, [new HttpService()]
)

HttpService.listen({ port: PORT })