import { Module } from '@esliph/module'
import { AppModule } from '@app.module'
import { JobModule } from '@job.module'
import { ServiceModule } from '@services/service.module'
import { RepositoryModule } from '@repositories/repository.module'

@Module({
    imports: [ServiceModule, RepositoryModule, AppModule, JobModule],
    providers: [],
})
export class MainModule { }
