import { CalcDateRepeatManager } from '@modules/financial-transaction/manager/calc-date-repeat'
import { FinancialTransactionModel } from '@modules/financial-transaction/model'

const { financialTransactionRepository } = FinancialTransactionModel

export async function duplicateSchedule() {
    const financialTransactions = await financialTransactionRepository.execQuery<FinancialTransactionModel.FinancialTransaction[]>`SELECT 
        id as "id",
        bank_account_id as "bankAccountId",
        title as "title",
        description as "description",
        value as "value",
        is_observable as "isObservable",
        is_send_notification as "isSendNotification",
        times_to_repeat as "timesToRepeat",
        count_repeated_occurrences as "countRepeatedOccurrences",
        type as "type",
        sender_recipient as "senderRecipient",
        type_occurrence as "typeOccurrence",
        frequency as "frequency",
        situation as "situation",
        expires_in as "expiresIn",
        date_time_competence as "dateTimeCompetence",
        created_at as "createdAt",
        updated_at as "updatedAt"
    FROM
        public.financial_transactions
    WHERE
        frequency IS NOT NULL
        AND type_occurrence::text = ${FinancialTransactionModel.TypeOccurrence.PROGRAMMATIC}
        AND count_repeated_occurrences < times_to_repeat`

    const now = new Date(Date.now())

    await financialTransactionRepository.createMany({
        data: financialTransactions
            .filter(financialTransaction => {
                const nextDate = CalcDateRepeatManager.calcNextDate(financialTransaction.createdAt, financialTransaction.frequency!, financialTransaction.countRepeatedOccurrences)

                now.setHours(0, 0, 0, 0)
                nextDate.setHours(0, 0, 0, 0)

                return nextDate <= now
            })
            .map(financialTransaction => ({
                ...financialTransaction,
                id: undefined,
                frequency: null,
                typeOccurrence: FinancialTransactionModel.TypeOccurrence.SINGLE,
                notes: {
                    create: {
                        note: {
                            create: {
                                description: `Financial transaction duplicated from #${financialTransaction.id} - "${financialTransaction.title}"`
                            }
                        }
                    }
                }
            }))
    })

    return { message: 'Financial transactions duplicated with successfully' }
}