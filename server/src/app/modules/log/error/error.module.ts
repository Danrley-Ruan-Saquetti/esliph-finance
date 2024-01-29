import { Module } from '@core'
import { LogErrorController } from '@modules/log/error/error.controller'
import { LogErrorRepository } from '@modules/log/error/error.repository'
import { LogErrorUseCaseModule } from '@modules/log/error/use-case/use-case.module'

@Module({
    imports: [LogErrorUseCaseModule],
    controllers: [LogErrorController],
    providers: [LogErrorRepository],
})
export class LogErrorModule { }
