import { Injection } from '@esliph/injection'
import { Cron, Job } from '@services/job.service'
import { CronExpression } from '@util'
import { DateService } from '@services/date.service'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'

@Job({ name: 'job.financial-transaction' })
export class FinancialTransactionJob {

    constructor(
        @Injection.Inject('financial-transaction.repository') private repositoryFinancialTransaction: FinancialTransactionRepository,
        @Injection.Inject('date') private dateService: DateService,
    ) { }

    @Cron({ name: 'update-situation-transactions-late', cronTime: CronExpression.EVERY_5_SECONDS, alreadyStart: true })
    async update() {
        const transaction = this.repositoryFinancialTransaction.transaction()

        try {
            transaction.begin()

            const database = this.repositoryFinancialTransaction.getDatabase()
            const dateNow = this.dateService.now()

            const financialTransactionsLate = await database.financialTransaction.findMany({
                where: {
                    expiresIn: { lt: dateNow },
                    situation: {
                        in: [FinancialTransactionModel.Situation.PENDING]
                    }
                },
                take: 10
            })

            const ids = financialTransactionsLate.map(({ id }) => id)

            await database.financialTransaction.updateMany({
                data: { situation: FinancialTransactionModel.Situation.LATE },
                where: { id: { in: ids } },
            })

            transaction.commit()
        } catch (err: any) {
            transaction.rollback()
            console.log(err)
        }
    }
}