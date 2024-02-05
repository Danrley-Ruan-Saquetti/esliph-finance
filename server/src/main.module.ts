import { Module } from '@core'
import { AppModule } from '@app.module'
import { JobModule } from '@job.module'
import { PublicModule } from '@public.module'
import { ServiceModule } from '@services/service.module'
import { RepositoryModule } from '@repositories/repository.module'
import { FilterModule } from '@filters/filter.modules'
import { ControllerModule } from '@controllers/controller.module'

@Module({
    imports: [ServiceModule, RepositoryModule, FilterModule, ControllerModule, AppModule, JobModule, PublicModule],
})
export class MainModule { }
