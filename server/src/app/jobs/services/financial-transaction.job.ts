import { Injection } from '@core'
import { Cron, Job } from '@services/job.service'
import { CronExpression } from '@util'
import { FinancialTransactionUpdateSituationLateUseCase } from '@modules/financial-transaction/use-case/update-situation-late.use-case'
import { FinancialTransactionDuplicateTransactionsRepeatUseCase } from '@modules/financial-transaction/use-case/duplicate-transactions-repeat.use-case.ts'

@Job({ name: 'job.financial-transaction' })
export class FinancialTransactionJob {
    constructor(
        @Injection.Inject('financial-transaction.use-case.update-situation-late') private updateSituationLateUC: FinancialTransactionUpdateSituationLateUseCase,
        @Injection.Inject('financial-transaction.use-case.duplicate-transactions-repeat') private duplicateTransactionsRepeatUC: FinancialTransactionDuplicateTransactionsRepeatUseCase
    ) { }

    @Cron({ name: 'update-situation-transactions-late', cronTime: CronExpression.EVERY_DAY_AT_6AM, start: false })
    async updateTransactionsLate() {
        await this.updateSituationLateUC.perform()
    }

    @Cron({ name: 'create-transaction-repeat', cronTime: CronExpression.EVERY_DAY_AT_6AM, start: false })
    async createTransactionsInRepeat() {
        await this.duplicateTransactionsRepeatUC.perform()
    }
}