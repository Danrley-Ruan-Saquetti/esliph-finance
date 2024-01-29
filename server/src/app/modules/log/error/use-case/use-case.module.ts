import { Module } from '@core'
import { LogErrorCreateUseCase } from '@modules/log/error/use-case/create.use-case'
import { LogErrorQueryUseCase } from '@modules/log/error/use-case/query.use-case'

@Module({
    providers: [LogErrorCreateUseCase, LogErrorQueryUseCase],
})
export class LogErrorUseCaseModule { }
