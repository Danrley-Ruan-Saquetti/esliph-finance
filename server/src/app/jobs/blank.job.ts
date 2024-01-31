import { Cron, Job } from '@services/job.service'
import { CronExpression } from '@util'

@Job({ name: 'job.blank' })
export class BlankJob {

    constructor() { }

    @Cron({ name: 'foo', cronTime: CronExpression.EVERY_SECOND, ignore: true })
    async foo() { }
}