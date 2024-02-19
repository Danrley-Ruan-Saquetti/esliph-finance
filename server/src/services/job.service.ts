import { Service, ApplicationModule, JobOptions, Job as EsliphJob, CronOptions, Cron as EsliphCron, BootstrapJob, isJob, Injection, Result, JobController } from '@core'
import { ClassConstructor } from '@@types'
import { isInstance } from '@util'
import { GLOBAL_LOG_CONFIG } from '@global'
import { WriteStreamOutputService } from '@services/write-stream-output.service'
import { EmitterEventService } from '@services/emitter-event.service'
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
export class JobService extends JobController {
    constructor() { super() }

    static onStart() {
        const writer = WriteStreamOutputService.newInstance(`${GLOBAL_LOG_CONFIG.path}/job.log`)
        const emitter = Injection.resolve(EmitterEventService)

        const jobsProviders = ApplicationModule.getProviders().filter(provider => isInstance(provider)).filter(provider => isJob(provider)) as ClassConstructor[]

        ApplicationModule.listener.on('job/start', data => {
            writer.write(`Job "${data.name}" start`)
        })
        ApplicationModule.listener.on('job/end', data => {
            writer.write(`Job "${data.name}" end`)
        })
        ApplicationModule.listener.on('job/error', async data => {
            await emitter.emit('/local/errors/create', { title: `JOB - ${data.name}`, ...data, ...data.error, origin: 'JOB' })
            writer.write(`Job "${data.name}" error: "${data.error.message}"`)
        })

        BootstrapJob({ jobs: jobsProviders })
    }
}