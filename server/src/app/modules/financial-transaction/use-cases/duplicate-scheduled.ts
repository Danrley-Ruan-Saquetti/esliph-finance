import { FinancialTransactionModel } from '@modules/financial-transaction/model'
import { getFinancialTransactionsToRepeat } from '@modules/financial-transaction/helpers'

const { financialTransactionRepository } = FinancialTransactionModel

export async function duplicateSchedule() {
    const financialTransactions = await getFinancialTransactionsToRepeat()

    await financialTransactionRepository.createMany({
        data: financialTransactions
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