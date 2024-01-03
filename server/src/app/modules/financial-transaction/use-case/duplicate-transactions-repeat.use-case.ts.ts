import { Injection } from '@esliph/injection'
import { Result } from '@esliph/common'
import { Service } from '@esliph/module'
import { UseCase } from '@common/use-case'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'
import { FinancialTransactionCreateUseCase } from '@modules/financial-transaction/use-case/create.use-case'

@Service({ name: 'financial-transaction.use-case.duplicate-transactions-repeat' })
export class FinancialTransactionDuplicateTransactionsRepeatUseCase extends UseCase {
    constructor(
        @Injection.Inject('financial-transaction.repository') private repository: FinancialTransactionRepository,
        @Injection.Inject('financial-transaction.use-case.create') private createUC: FinancialTransactionCreateUseCase,
    ) {
        super()
    }

    async perform() {
        const transaction = this.repository.transaction()

        try {
            await transaction.begin()

            const financialTransactions = await this.repository.getDatabase().$queryRawUnsafe<FinancialTransactionModel.FinancialTransaction[]>('SELECT * FROM public.financial_transaction WHERE type_occurrence::text = $1 AND count_repeated_occurrences < times_to_repeat', FinancialTransactionModel.TypeOccurrence.PROGRAMMATIC)

            financialTransactions.map(async transaction => {
                const isSuccess = await this.duplicate({
                    ...transaction,
                    bankAccountId: transaction['bank_account_id'],
                    dateTimeCompetence: transaction['date_time_competence'],
                    expiresIn: transaction['expires_in'],
                    isObservable: transaction['is_observable'],
                    isSendNotification: transaction['is_send_notification']
                })

                if (!isSuccess) {
                    return
                }

                await this.repository.getDatabase().financialTransaction.update({
                    data: {
                        countRepeatedOccurrences: { increment: 1 }
                    },
                    where: { id: transaction.id }
                })
            })

            await transaction.commit()

            return Result.success({ message: 'Create transactions in repeat successfully' })
        } catch (err: any) {
            await transaction.rollback()

            return Result.failure({ title: 'Create Transactions in Repeat', message: `Cannot create transactions in repeat. Error: "${err.message}"` })
        }
    }

    private async duplicate({ bankAccountId, dateTimeCompetence, description, expiresIn, isObservable, isSendNotification, priority, receiver, sender, title, type, value }: FinancialTransactionModel.FinancialTransaction) {
        const result = await this.createUC.perform({
            bankAccountId: bankAccountId,
            dateTimeCompetence: dateTimeCompetence,
            description: description,
            expiresIn: expiresIn,
            isObservable: isObservable,
            isSendNotification: isSendNotification,
            priority: priority,
            receiver: receiver,
            sender: sender,
            title: title,
            type: type,
            value: value,
            typeOccurrence: FinancialTransactionModel.TypeOccurrence.SINGLE
        })

        return result.isSuccess()
    }
}