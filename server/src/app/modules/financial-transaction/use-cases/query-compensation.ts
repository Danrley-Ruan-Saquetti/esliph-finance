import { z, Validator } from '@services/validator'
import { GLOBAL_BANK_ACCOUNT_DTO } from '@modules/bank-account/global'
import { FinancialTransactionModel } from '@modules/financial-transaction/model'
import { CompensationPaymentManager } from '@modules/payment/financial-transaction/manager/compensation-payment'
import { GLOBAL_FINANCIAL_TRANSACTION_DTO } from '@modules/financial-transaction/global'

const { financialTransactionRepository } = FinancialTransactionModel

const schemaQuery = z.object({
    id: GLOBAL_FINANCIAL_TRANSACTION_DTO.id,
    bankAccountId: GLOBAL_BANK_ACCOUNT_DTO.id,
})

export type QueryDTOArgs = z.input<typeof schemaQuery>

export async function queryCompensation(args: QueryDTOArgs) {
    const { bankAccountId, id } = Validator.parseNoSafe(args, schemaQuery)

    const { payments, ...financialTransaction } = await financialTransactionRepository.findUniqueOrThrow({
        where: { bankAccountId, id },
        include: { payments: true },
    })

    return new CompensationPaymentManager(financialTransaction, payments).getPaymentStatementInReal()
}