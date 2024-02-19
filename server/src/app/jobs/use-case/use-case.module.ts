import { Module } from '@core'
import { JobQueryUseCase } from '@jobs/use-case/query.use-case'

@Module({
    providers: [JobQueryUseCase],
})
export class JobUseCaseModule { }
