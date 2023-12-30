import { Injection } from '@esliph/injection'
import { Cron, Job } from '@services/job.service'
import { CronExpression } from '@util'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'

@Job({ name: 'update-situation-transaction' })
export class UpdateSituationTransaction {

    constructor(
        @Injection.Inject('financial-transaction.repository') private repositoryFinancialTransaction: FinancialTransactionRepository
    ) { }

    @Cron({ name: 'update-situation', cronTime: CronExpression.EVERY_5_SECONDS })
    async update() {
        const dateNow = new Date(Date.now())

        const financialTransactionsLate = await this.repositoryFinancialTransaction.getDatabase().financialTransaction.findMany({
            where: {
                expiresIn: { lt: dateNow },
                situation: {
                    in: [FinancialTransactionModel.Situation.PENDING, FinancialTransactionModel.Situation.PARTIALLY_PAID, FinancialTransactionModel.Situation.PARTIALLY_RECEIVED]
                }
            },
            take: 10
        })
    }
}