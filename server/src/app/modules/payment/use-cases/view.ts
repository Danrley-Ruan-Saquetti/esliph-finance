import { DTO } from '@util/dto'
import { Validator, z } from '@services/validator'
import { PaymentModel } from '@modules/payment/model'
import { MonetaryValue } from '@services/monetary-value'
import { GLOBAL_BANK_ACCOUNT_DTO } from '@modules/bank-account/global'
import { GLOBAL_FINANCIAL_TRANSACTION_DTO } from '@modules/financial-transaction/global'

const { paymentRepository } = PaymentModel

const schemaView = z.object({
    id: DTO.id.schema({ name: 'id' }),
    financialTransactionId: GLOBAL_FINANCIAL_TRANSACTION_DTO.id,
    bankAccountId: GLOBAL_BANK_ACCOUNT_DTO.id,
})

export type PaymentViewDTOArgs = z.input<typeof schemaView>

export async function view(args: PaymentViewDTOArgs) {
    const { id, financialTransactionId, bankAccountId } = Validator.parseNoSafe(args, schemaView)

    const payment = await paymentRepository.findUniqueOrThrow({
        where: { id, financialTransaction: { id: financialTransactionId, bankAccountId } },
        select: {
            id: true,
            valuePaid: true,
            discount: true,
            increase: true,
            observation: true,
            paidAt: true,
            createdAt: true,
            financialTransaction: {
                select: {
                    id: true,
                    title: true,
                    value: true,
                }
            }
        }
    })

    return {
        ...payment,
        valuePaid: MonetaryValue.toReal(payment.valuePaid),
        discount: MonetaryValue.toReal(payment.discount),
        increase: MonetaryValue.toReal(payment.increase),
        financialTransaction: {
            ...payment.financialTransaction,
            value: MonetaryValue.toReal(payment.financialTransaction.value)
        },
    }
}
