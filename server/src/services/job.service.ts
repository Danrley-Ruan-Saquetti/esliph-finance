import { Service, ApplicationModule } from '@esliph/module'
import { JobOptions, Job as EsliphJob, CronOptions, Cron as EsliphCron, Bootstrap as JobBootstrap, isJob } from '@esliph/job'
import { isInstance } from '@util'
import { ClassConstructor } from '@@types'
export * from '@esliph/job'

export function Job(options: JobOptions) {
    return (constructor: any) => {
        // @ts-expect-error
        Service({ name: `service.${options.name}`, context: 'Job' })(constructor)
        // @ts-expect-error
        return EsliphJob({ timeZone: 'Zulu', ...options })(constructor)
    }
}

export function Cron(options: CronOptions) {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        // @ts-expect-error
        return EsliphCron({ timeZone: 'Zulu', ...options })(target, key, descriptor)
    }
}

@Service({ name: 'global.service.job' })
export class JobService {
    static onStart() {
        const jobsProviders = ApplicationModule.getProviders().filter(provider => isInstance(provider)).filter(provider => isJob(provider)) as ClassConstructor[]

        JobBootstrap(jobsProviders)
    }
}