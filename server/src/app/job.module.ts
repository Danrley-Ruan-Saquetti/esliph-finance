import { Module } from '@esliph/module'
import { TestJob } from '@app/jobs/test.job'

@Module({
    providers: [TestJob]
})
export class JobModule {

}