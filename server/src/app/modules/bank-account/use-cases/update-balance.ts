import { ID } from '@@types'
import { DTO } from '@util/dto'
import { Validator, z } from '@services/validator'
import { MonetaryValue } from '@services/monetary-value'
import { BankAccountModel } from '@modules/bank-account/model'
import { GLOBAL_BANK_ACCOUNT_DTO } from '@modules/bank-account/global'
import { FinancialTransactionModel } from '@modules/financial-transaction/model'
import { getFinancialTransactionsWithPaymentsActiveByBankAccountId } from '@modules/financial-transaction/helpers'

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

    const operationUpdate = operation == 'INCOME' ? 'increment' : 'decrement'

    await bankAccountRepository.update({
        data: { balance: { [operationUpdate]: value } },
        where: { id: bankAccountId }
    })

    return { message: 'Bank account balance updated successfully' }
}

export async function recalculateBalance({ id }: { id: ID }) {
    id = Validator.parseNoSafe(id, GLOBAL_BANK_ACCOUNT_DTO.id)

    const financialTransactions = await getFinancialTransactionsWithPaymentsActiveByBankAccountId(id)

    let balanceTotal = financialTransactions.reduce((totalFinancialTransactions, { payments, type }) => {
        const alpha = type == FinancialTransactionModel.Type.INCOME ? 1 : -1

        return payments.reduce((totalPayments, { valuePaid }) => totalPayments + (valuePaid * alpha), totalFinancialTransactions)
    }, 0)

    await bankAccountRepository.update({
        data: { balance: balanceTotal },
        where: { id }
    })

    return { message: 'Bank account balance updated successfully' }
}