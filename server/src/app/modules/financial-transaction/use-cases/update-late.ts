import { FinancialTransactionModel } from '@modules/financial-transaction/model'

const { financialTransactionRepository } = FinancialTransactionModel

export async function updateLate() {
    const dateNow = new Date(Date.now())

    const financialTransaction = await financialTransactionRepository.findMany({
        where: {
            situation: FinancialTransactionModel.Situation.PENDING,
            expiresIn: { not: null, lt: dateNow }
        },
        take: 100,
        orderBy: { expiresIn: 'desc' }
    })

    if (!financialTransaction.length)
        return { message: 'No financial transactions to update' }

    await financialTransactionRepository.updateMany({
        data: { situation: FinancialTransactionModel.Situation.LATE },
        where: { id: { in: financialTransaction.map(({ id }) => id) } }
    })

    return { message: 'Situation of financial transactions updated successfully' }
}