import { Module } from '@core'
import { ErrorController } from '@controllers/error.controller'
import { ServerController } from '@controllers/server.controller'

@Module({
    controllers: [ErrorController, ServerController]
})
export class ControllerModule { }
