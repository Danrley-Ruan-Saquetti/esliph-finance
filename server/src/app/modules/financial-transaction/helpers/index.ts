import { ID } from '@@types'
import { CalcDateRepeatManager } from '@modules/financial-transaction/manager/calc-date-repeat'
import { FinancialTransactionModel } from '@modules/financial-transaction/model'
import { GLOBAL_FINANCIAL_TRANSACTION_RULES } from '@modules/financial-transaction/global'

const { financialTransactionRepository, Situation } = FinancialTransactionModel

export async function getFinancialTransactionsToRepeat() {
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

    return financialTransactions
        .filter(financialTransaction => CalcDateRepeatManager.isDateContainedDeadlineToRepeat(now, financialTransaction.createdAt, financialTransaction.frequency!, financialTransaction.countRepeatedOccurrences))
}

export async function getFinancialTransactionsLated() {
    const dateNow = new Date(Date.now())

    return await financialTransactionRepository.findMany({
        where: {
            situation: FinancialTransactionModel.Situation.PENDING,
            expiresIn: { not: null, lt: dateNow }
        },
        take: 100,
        orderBy: { expiresIn: 'desc' }
    })
}

export async function getFinancialTransactionsWithPaymentsActiveByBankAccountId(bankAccountId: ID) {
    return await financialTransactionRepository.findMany({
        where: {
            bankAccountId,
            situation: {
                in: [
                    Situation.PAID_OUT,
                    Situation.PARTIALLY_PAID,
                    Situation.PARTIALLY_RECEIVED,
                    Situation.RECEIVED,
                ]
            }
        },
        include: { payments: true }
    })
}

export function isSituationHasAllowedToCreatePayment(situation: FinancialTransactionModel.Situation) {
    return !!GLOBAL_FINANCIAL_TRANSACTION_RULES.paid.situationsEnableToPaid.enum.find(situationAllowed => situationAllowed == situation)
}