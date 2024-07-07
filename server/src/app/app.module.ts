import { Module } from '@server/components/module'
import { JobModule } from '@jobs/job.module'
import { DomainModule } from '@domains/domain.module'
import { ModuleModule } from '@modules/module.module'

@Module({
    imports: [
        ModuleModule,
        DomainModule,
        JobModule
    ],
})
export class AppModule { }