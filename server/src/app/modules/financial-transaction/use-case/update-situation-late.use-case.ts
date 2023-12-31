import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { UseCase } from '@common/use-case'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'
import { Result } from '@esliph/common'

@Service({ name: 'financial-transaction.use-case.update-situation-late' })
export class FinancialTransactionUpdateSituationLateUseCase extends UseCase {
    constructor(@Injection.Inject('financial-transaction.repository') private transactionRepository: FinancialTransactionRepository) {
        super()
    }

    async perform() {
        const transaction = this.database.transaction()

        try {
            await transaction.begin()

            const database = this.transactionRepository.getDatabase()
            const dateNow = this.dateService.now()

            await database.financialTransaction.updateMany({
                data: { situation: FinancialTransactionModel.Situation.LATE },
                where: {
                    expiresIn: { lt: dateNow },
                    situation: {
                        in: [FinancialTransactionModel.Situation.PENDING],
                    },
                },
            })

            await transaction.commit()

            return Result.success({ message: 'Update situations of the transactions successfully' })
        } catch (err: any) {
            await transaction.rollback()

            return Result.failure({
                title: 'Update Situations Transactions Late',
                message: `Cannot be update situation of the transactions. Error: "${err.message}"`,
            })
        }
    }
}
