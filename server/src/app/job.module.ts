import { Module } from '@esliph/module'
import { UpdateSituationTransaction } from '@app/jobs/update-situation-transaction.job'

@Module({
    providers: [UpdateSituationTransaction]
})
export class JobModule {

}