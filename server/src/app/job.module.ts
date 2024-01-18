import { Module } from '@core'
import { FinancialTransactionJob } from '@jobs/financial-transaction.job'
import { MailJob } from '@jobs/mail.job'

@Module({
    providers: [
        FinancialTransactionJob,
        MailJob
    ]
})
export class JobModule { }