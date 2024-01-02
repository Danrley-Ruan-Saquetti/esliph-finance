import { Module } from '@esliph/module'
import { FinancialTransactionJob } from '@app/jobs/financial-transaction.job'

@Module({
    providers: [FinancialTransactionJob]
})
export class JobModule {

}