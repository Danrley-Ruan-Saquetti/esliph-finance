import { Bootstrap } from '@esliph/module'
import { MainModule } from '@main.module'

Bootstrap(MainModule, { logLoad: true, logEventHttp: true, logEventListener: true })
