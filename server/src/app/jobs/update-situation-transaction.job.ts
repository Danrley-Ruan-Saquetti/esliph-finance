import { Injection } from '@esliph/injection'
import { Cron, Job } from '@services/job.service'
import { CronExpression } from '@util'
import { DateService } from '@services/date.service'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'

@Job({ name: 'update-situation-transaction' })
export class UpdateSituationTransaction {

    constructor(
        @Injection.Inject('financial-transaction.repository') private repositoryFinancialTransaction: FinancialTransactionRepository,
        @Injection.Inject('date') private dateService: DateService,
    ) { }

    @Cron({ name: 'update-situation', cronTime: CronExpression.EVERY_30_MINUTES, alreadyStart: true })
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
                        in: [FinancialTransactionModel.Situation.PENDING, FinancialTransactionModel.Situation.PARTIALLY_PAID, FinancialTransactionModel.Situation.PARTIALLY_RECEIVED]
                    }
                },
                take: 10
            })

            transaction.commit()

            console.log(financialTransactionsLate)
        } catch (err: any) {
            transaction.rollback()
            console.log(err)
        }
    }
}