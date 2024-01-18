import { Service, ApplicationModule } from '@esliph/module'
import { JobOptions, Job as EsliphJob, CronOptions, Cron as EsliphCron, Bootstrap as JobBootstrap, isJob } from '@esliph/job'
import { ClassConstructor } from '@@types'
import { isInstance } from '@util'
import { GLOBAL_LOG_CONFIG } from '@global'
import { WriteStreamOutputService } from '@services/write-stream-output.service'
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
    constructor() { }

    static onStart() {
        const writer = WriteStreamOutputService.newInstance(`${GLOBAL_LOG_CONFIG.path}/job.log`)

        const jobsProviders = ApplicationModule.getProviders().filter(provider => isInstance(provider)).filter(provider => isJob(provider)) as ClassConstructor[]

        ApplicationModule.listener.on('job/start', data => {
            writer.write(`Job "${data.name}" start`)
        })
        ApplicationModule.listener.on('job/end', data => {
            writer.write(`Job "${data.name}" end`)
        })
        ApplicationModule.listener.on('job/error', data => {
            writer.write(`Job "${data.name}" error: "${data.error.message}"`)
        })

        JobBootstrap(jobsProviders)
    }
}