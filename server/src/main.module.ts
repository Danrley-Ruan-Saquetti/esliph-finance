import { Module } from '@core'
import { AppModule } from '@app.module'
import { JobModule } from '@job.module'
import { ServiceModule } from '@services/service.module'
import { RepositoryModule } from '@repositories/repository.module'
import { FilterModule } from '@filters/filter.modules'

@Module({
    imports: [ServiceModule, RepositoryModule, FilterModule, AppModule, JobModule],
})
export class MainModule { }
