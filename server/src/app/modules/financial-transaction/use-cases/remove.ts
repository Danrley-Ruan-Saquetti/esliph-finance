import { Transaction } from '@services/database'
import { Validator, z } from '@services/validator'
import { MonetaryValue } from '@services/monetary-value'
import { updateBalance } from '@modules/bank-account/use-cases/update-balance'
import { GLOBAL_BANK_ACCOUNT_DTO } from '@modules/bank-account/global'
import { FinancialTransactionModel } from '@modules/financial-transaction/model'
import { GLOBAL_FINANCIAL_TRANSACTION_DTO } from '@modules/financial-transaction/global'

const { financialTransactionRepository } = FinancialTransactionModel

const removeSchema = z.object({
    id: GLOBAL_FINANCIAL_TRANSACTION_DTO.id,
    bankAccountId: GLOBAL_BANK_ACCOUNT_DTO.id
})

export type FinancialTransactionRemoveDTOArgs = z.input<typeof removeSchema>

export async function remove(args: FinancialTransactionRemoveDTOArgs) {
    const { bankAccountId, id } = Validator.parseNoSafe(args, removeSchema)

    const financialTransaction = await financialTransactionRepository.findUniqueOrThrow({
        where: { id, bankAccountId },
        include: { payments: true },
    })

    const transaction = await Transaction.begin()

    try {
        await financialTransactionRepository.delete({ where: { id, bankAccountId } })

        const valueToAdjustBankAccount = financialTransaction.payments.reduce((acc, payment) => acc + payment.valuePaid, 0)

        await updateBalance({
            bankAccountId,
            value: MonetaryValue.toReal(valueToAdjustBankAccount),
            operation: financialTransaction.type == FinancialTransactionModel.Type.EXPENSE ? 'INCOME' : 'EXPENSE',
        })

        await transaction.commit()

        return { message: 'Financial transaction removed successfully' }
    } catch (err) {
        await transaction.rollback()
        throw err
    }
}