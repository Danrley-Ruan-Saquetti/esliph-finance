import { ApplicationModule, Bootstrap, Module, Service } from '@esliph/module'
import { Job, isJob, Bootstrap as JobBootstrap, Cron } from '@services/job.service'
import { isInstance } from '@util'
import { ClassConstructor } from '@@types'

@Job({ name: 'my-job', cronTime: '* * * * * *' })
class MyJob {

    @Cron({ name: 'hello' })
    hello() {
        console.log('!')
    }
}

@Service({ name: 'global.service.job' })
class JobService {
    static onStart() {
        const jobsProviders = ApplicationModule.getProviders().filter(provider => isInstance(provider)).filter(provider => isJob(provider)) as ClassConstructor[]

        JobBootstrap(jobsProviders)
    }
}

@Module({
    providers: [JobService, MyJob]
})
class TestModule { }

Bootstrap(TestModule, { log: { load: true } })