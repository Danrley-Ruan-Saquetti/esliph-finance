import { Module } from '@core'
import { JobController } from '@jobs/job.controller'
import { FinancialTransactionJob } from '@jobs/services/financial-transaction.job'
import { MailJob } from '@jobs/services/mail.job'
import { JobUseCaseModule } from '@app/jobs/use-case/use-case.module'
import { JobRepository } from '@jobs/job.repository'
// import { BlankJob } from '@jobs/services/blank.job'

@Module({
    imports: [JobUseCaseModule],
    providers: [
        // BlankJob,
        FinancialTransactionJob,
        MailJob,
        JobRepository
    ],
    controllers: [JobController]
})
export class JobModule { }