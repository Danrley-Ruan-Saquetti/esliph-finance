import { ID } from '@@types'
import { DTO } from '@util/dto'
import { Validator, z } from '@services/validator'
import { MonetaryValue } from '@services/monetary-value'
import { BankAccountModel } from '@modules/bank-account/model'
import { GLOBAL_BANK_ACCOUNT_DTO } from '@modules/bank-account/global'
import { FinancialTransactionModel } from '@modules/financial-transaction/model'

const { financialTransactionRepository } = FinancialTransactionModel
const { bankAccountRepository } = BankAccountModel

const updateBalanceSchema = z.object({
    bankAccountId: GLOBAL_BANK_ACCOUNT_DTO.id,
    value: z
        .coerce
        .number({
            'required_error': DTO.required('Value'),
            'invalid_type_error': 'The value must be greater than 0 (zero)',
        })
        .nonnegative('The value must be greater than 0 (zero)')
        .transform(val => MonetaryValue.toCents(val)),
    operation: z
        .enum(['INCOME', 'EXPENSE'], { errorMap: () => ({ message: 'the type of operation can only be INCOME or EXPENSE' }) })
})

export type BankAccountUpdateBalanceDTOArgs = z.input<typeof updateBalanceSchema>

export async function updateBalance(args: BankAccountUpdateBalanceDTOArgs) {
    const { bankAccountId, value, operation } = Validator.parseNoSafe(args, updateBalanceSchema)

    await bankAccountRepository.checkExistsOrTrow({ where: { id: bankAccountId } })

    let operationUpdate = operation == 'INCOME' ? 'increment' : 'decrement'

    await bankAccountRepository.update({
        data: { balance: { [operationUpdate]: value } },
        where: { id: bankAccountId }
    })

    return { message: 'Bank account balance updated successfully' }
}

export async function recalculateBalance({ id }: { id: ID }) {
    id = Validator.parseNoSafe(id, GLOBAL_BANK_ACCOUNT_DTO.id)

    const financialTransactions = await financialTransactionRepository.findMany({
        where: {
            bankAccountId: id,
            situation: {
                in: [
                    FinancialTransactionModel.Situation.PAID_OUT,
                    FinancialTransactionModel.Situation.PARTIALLY_PAID,
                    FinancialTransactionModel.Situation.PARTIALLY_RECEIVED,
                    FinancialTransactionModel.Situation.RECEIVED,
                ]
            }
        },
        include: { payments: true }
    })

    let totalValue = 0

    for (let i = 0; i < financialTransactions.length; i++) {
        const financialTransaction = financialTransactions[i]

        for (let j = 0; j < financialTransaction.payments.length; j++) {
            const payment = financialTransaction.payments[j]

            if (financialTransaction.type == FinancialTransactionModel.Type.INCOME)
                totalValue += payment.valuePaid
            else
                totalValue -= payment.valuePaid
        }
    }

    await bankAccountRepository.update({
        data: { balance: totalValue },
        where: { id }
    })

    return { message: 'Bank account balance updated successfully' }
}