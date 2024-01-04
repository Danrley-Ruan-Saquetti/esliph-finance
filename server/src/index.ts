import '@config'
import { Bootstrap } from '@esliph/module'
import { HttpService } from '@services/http.service'
import { MainModule } from '@main.module'
import { Logger } from '@services/logger.service'

Bootstrap(
    MainModule,
    {
        logger: new Logger(),
        log: { load: false }
    }, [new HttpService()]
)