import { Module } from '@server/components/module'
import { FinancialTransactionJob } from '@jobs/services/financial-transaction'
import { JobController } from '@jobs/job.controller'

@Module({
    controllers: [
        JobController
    ],
    providers: [
        FinancialTransactionJob
    ]
})
export class JobModule { }