import { Job, Cron } from '@services/job'
import { updateLate } from '@modules/financial-transaction/use-cases/update-late'

@Job('financial-transaction')
export class FinancialTransactionJob {

    @Cron('update-late', '0 6 * * *')
    async updateLate() {
        await updateLate()
    }
}