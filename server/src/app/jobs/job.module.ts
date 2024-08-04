import { Module } from '@server/components/module'
import { FinancialTransactionJob } from '@jobs/services/financial-transaction'

@Module({
    providers: [
        FinancialTransactionJob
    ]
})
export class JobModule { }