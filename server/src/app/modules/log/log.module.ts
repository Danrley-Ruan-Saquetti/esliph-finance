import { Module } from '@core'
import { LogErrorModule } from '@modules/log/error/error.module'

@Module({
    imports: [LogErrorModule],
})
export class LogModule { }
