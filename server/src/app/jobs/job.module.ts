import { Module } from '@server/components/module'
import { FinancialTransactionJob } from '@jobs/financial-transaction'

@Module({
    providers: [
        FinancialTransactionJob
    ]
})
export class JobModule { }