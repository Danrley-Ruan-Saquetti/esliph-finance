import { Injection } from '@esliph/injection'
import { Result } from '@esliph/common'
import { Service } from '@esliph/module'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'
import { FinancialTransactionCreateUseCase } from '@modules/financial-transaction/use-case/create.use-case'
import { CalcDateRepeatControl } from '@modules/financial-transaction/control/calc-date-repeat.control'

type IFinancialTransactionDuplicateArgs = Pick<
    FinancialTransactionModel.FinancialTransaction,
    | 'id'
    | 'bankAccountId'
    | 'dateTimeCompetence'
    | 'description'
    | 'expiresIn'
    | 'isObservable'
    | 'isSendNotification'
    | 'priority'
    | 'receiver'
    | 'sender'
    | 'title'
    | 'type'
    | 'value'
    | 'countRepeatedOccurrences'
    | 'timesToRepeat'
>

@Service({ name: 'financial-transaction.use-case.duplicate-transactions-repeat' })
export class FinancialTransactionDuplicateTransactionsRepeatUseCase extends UseCase {
    constructor(
        @Injection.Inject('financial-transaction.repository') private transactionRepository: FinancialTransactionRepository,
        @Injection.Inject('financial-transaction.use-case.create') private createUC: FinancialTransactionCreateUseCase,
        @Injection.Inject('calc-date-repeat.control') private calcDateRepeatControl: CalcDateRepeatControl,
    ) {
        super()
    }

    async perform() {
        let i = 0
        do {
            await this.performDuplicate()
            i++
        } while (i < 1)
    }

    async performDuplicate() {
        try {
            const financialTransactions = await this.queryTransactionToRepeat()
            await this.duplicateTransactions(financialTransactions)

            return Result.success({ message: 'Create transactions in repeat successfully' })
        } catch (err: any) {
            return Result.failure({ title: 'Create Transactions in Repeat', message: `Cannot create transactions in repeat. Error: "${err.message}"` })
        }
    }

    private async queryTransactionToRepeat() {
        const financialTransactionsToRepeat = await this.transactionRepository.findAllToRepeat()

        if (!financialTransactionsToRepeat.isSuccess()) {
            if (financialTransactionsToRepeat.isErrorInOperation()) {
                throw new BadRequestException({
                    ...financialTransactionsToRepeat.getError(),
                    title: 'Find All Financial Transaction to Repeat',
                })
            }

            return []
        }

        return financialTransactionsToRepeat.getValue()
    }

    private async duplicateTransactions(transactions: FinancialTransactionModel.FinancialTransaction[]) {
        transactions.map(async transaction => {
            const transactionDB = this.database.transaction()

            try {
                await transactionDB.begin()

                if (!this.validDuplicate(transaction)) {
                    return
                }

                const isSuccess = await this.duplicateTransaction(transaction)

                if (!isSuccess) {
                    return
                }

                await this.transactionRepository.getDatabase().financialTransaction.update({
                    data: {
                        countRepeatedOccurrences: { increment: 1 },
                    },
                    where: { id: transaction.id },
                })

                await transactionDB.commit()
            } catch (err: any) {
                await transactionDB.rollback()

                return Result.failure({ ...err, title: 'Create Transactions in Repeat', message: `Cannot create transactions in repeat. Error: "${err.message}"` })
            }
        })
    }

    private validDuplicate(transaction: FinancialTransactionModel.FinancialTransaction) {
        const now = this.dateService.now()
        const nextDate = this.calcDateRepeatControl.calcNextDate(transaction.createdAt, transaction.frequency, transaction.countRepeatedOccurrences)

        now.setHours(0, 0, 0, 0)
        nextDate.setHours(0, 0, 0, 0)

        return nextDate <= now
    }

    private async duplicateTransaction(transaction: IFinancialTransactionDuplicateArgs) {
        const result = await this.createUC.perform({
            bankAccountId: transaction.bankAccountId,
            dateTimeCompetence: transaction.dateTimeCompetence,
            description: transaction.description,
            expiresIn: transaction.expiresIn,
            isObservable: transaction.isObservable,
            isSendNotification: transaction.isSendNotification,
            priority: transaction.priority,
            receiver: transaction.receiver,
            sender: transaction.sender,
            title: transaction.title,
            type: transaction.type,
            value: transaction.value,
            typeOccurrence: FinancialTransactionModel.TypeOccurrence.SINGLE,
            notes: [
                { description: `Parent Financial Transaction #${transaction.id} (${transaction.countRepeatedOccurrences + 1}/${transaction.timesToRepeat})` },
            ],
        })

        return result.isSuccess()
    }
}
