import { Cron, Job } from '@services/job.service'

@Job({ name: 'test-job' })
export class TestJob {

}