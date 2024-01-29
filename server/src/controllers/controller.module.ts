import { Module } from '@core'
import { ErrorController } from '@controllers/error.controller'

@Module({
    controllers: [ErrorController]
})
export class ControllerModule { }
