import { CronExpression } from '@util/cron'
import { Job, Cron } from '@services/job'
import { updateLate } from '@modules/financial-transaction/use-cases/update-late'
import { duplicateSchedule } from '@modules/financial-transaction/use-cases/duplicate-scheduled'

@Job('financial-transaction')
export class FinancialTransactionJob {

    @Cron('update-late', CronExpression.EVERY_DAY_AT_6AM)
    async updateLate() {
        await updateLate()
    }

    @Cron('duplicate-schedule', CronExpression.EVERY_DAY_AT_7AM)
    async duplicateSchedule() {
        await duplicateSchedule()
    }
}