import '@config'
import { Bootstrap } from '@core'
import { HttpService } from '@services/http.service'
import { MainModule } from '@main.module'
import { Logger } from '@services/logger.service'

async function App() {
    await Bootstrap(
        MainModule,
        {
            logger: new Logger(),
            log: { load: false }
        }, [new HttpService()]
    )
}

App()