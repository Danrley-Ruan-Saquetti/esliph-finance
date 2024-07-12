import { FinancialTransactionModel } from '@modules/financial-transaction/model'

const { financialTransactionRepository } = FinancialTransactionModel

export async function updateLate() {
    const dateNow = new Date(Date.now())

    await financialTransactionRepository.updateMany({
        data: { situation: FinancialTransactionModel.Situation.LATE },
        where: {
            situation: FinancialTransactionModel.Situation.PENDING,
            expiresIn: { not: null, lt: dateNow }
        },
    })

    return { message: 'Situation of financial transactions updated successfully' }
}