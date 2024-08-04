import { ClassConstructor } from '@esliph/metadata'
import { JobOptions, JobProvider, Job as EsliphJob, Cron as EsliphCron, CronOptions, isJob } from '@esliph/job'
import { APP } from '@app'
import { isInstance, isString } from '@util/types'
export * from '@esliph/job'

export function Job(options: JobOptions): (constructor: any) => void
export function Job(name: string, options?: Omit<JobOptions, 'name' | 'conTime'>): (constructor: any) => void
export function Job(nameOptions: JobOptions | string, options: Omit<JobOptions, 'name' | 'conTime'> = {}) {
    if (isString(nameOptions))
        options = { name: nameOptions } as any
    else
        options = { ...nameOptions }

    return (constructor: any) => {
        if (!options.utcOffset && !options.timeZone)
            options.timeZone = 'Zulu'

        return EsliphJob({ start: true, cronTime: '* * * * *', ...options as any })(constructor)
    }
}

export function Cron(options: CronOptions): (target: any, key: string, descriptor: PropertyDescriptor) => void
export function Cron(name: string, cronTime?: string, options?: Omit<CronOptions, 'name' | 'conTime'>): (target: any, key: string, descriptor: PropertyDescriptor) => void
export function Cron(nameOptions: CronOptions | string, cronTime?: string, options: Omit<CronOptions, 'name' | 'conTime'> = {}) {
    if (isString(nameOptions))
        options = { name: nameOptions } as any
    else
        options = { ...nameOptions }

    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        if (!options.utcOffset && !options.timeZone)
            options.timeZone = 'Zulu'

        return EsliphCron({ start: true, cronTime: cronTime || '* * * * *', ...options as any })(target, key, descriptor)
    }
}

export class JobService extends JobProvider {

    static afterLoad() {
        const provider = new JobService()

        const jobs = APP.getProviders().filter(provider => isInstance(provider) && isJob(provider)) as ClassConstructor[]

        provider.fabric({ jobs })
    }
}