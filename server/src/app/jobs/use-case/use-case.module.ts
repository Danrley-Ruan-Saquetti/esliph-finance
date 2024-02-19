import { Module } from '@core'
import { JobQueryUseCase } from '@jobs/use-case/query.use-case'
import { JobExecuteUseCase } from '@jobs/use-case/execute.use-case'
import { JobStopUseCase } from '@jobs/use-case/stop.use-case'
import { JobStartUseCase } from '@jobs/use-case/start.use-case'

@Module({
    providers: [JobQueryUseCase, JobExecuteUseCase, JobStopUseCase, JobStartUseCase],
})
export class JobUseCaseModule { }
