import { Database } from '@services/database'
import { JobService } from '@services/job'
import { Get } from '@server/components/router'
import { Module } from '@server/components/module'
import { Controller } from '@server/components/controller'
import { AppModule } from '@app/app.module'

@Controller()
class MainController {

    @Get('/status')
    status() {
        return { status: true }
    }
}

@Module({
    imports: [
        AppModule,
    ],
    controllers: [
        MainController
    ],
    providers: [
        Database,
        JobService
    ]
})
export class MainModule { }