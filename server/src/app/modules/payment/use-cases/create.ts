import { DTO } from '@util/dto'
import { BadRequestException } from '@exceptions/bad-request'
import { Transaction } from '@services/database'
import { Validator, z } from '@services/validator'
import { MonetaryValue } from '@services/monetary-value'
import { PaymentModel } from '@modules/payment/model'
import { updateBalance } from '@modules/bank-account/use-cases/update-balance'
import { GLOBAL_PAYMENT_DTO } from '@modules/payment/global'
import { GLOBAL_BANK_ACCOUNT_DTO } from '@modules/bank-account/global'
import { FinancialTransactionModel } from '@modules/financial-transaction/model'
import { CompensationPaymentManager } from '@modules/payment/financial-transaction/manager/compensation-payment'
import { isSituationHasAllowedToCreatePayment } from '@modules/financial-transaction/helpers'

const { financialTransactionRepository } = FinancialTransactionModel
const { paymentRepository } = PaymentModel

const schemaCreate = z.object({
    bankAccountId: GLOBAL_BANK_ACCOUNT_DTO.id,
    financialTransactionId: GLOBAL_PAYMENT_DTO.financialTransaction.id,
    observation: z
        .string()
        .trim()
        .default(GLOBAL_PAYMENT_DTO.observation.default),
    valuePaid: z.coerce
        .number({ 'invalid_type_error': DTO.number.messageInvalidType('value paid'), })
        .nonnegative({ message: GLOBAL_PAYMENT_DTO.valuePaid.messageMustBePositive })
        .transform(MonetaryValue.toFixed)
        .transform(MonetaryValue.toCents),
    discount: z.coerce
        .number({ 'invalid_type_error': DTO.number.messageInvalidType('value') })
        .nonnegative({ message: GLOBAL_PAYMENT_DTO.discount.messageMustBePositive })
        .transform(MonetaryValue.toFixed)
        .transform(MonetaryValue.toCents)
        .default(GLOBAL_PAYMENT_DTO.discount.default),
    increase: z.coerce
        .number({ 'invalid_type_error': DTO.number.messageInvalidType('value') })
        .nonnegative({ message: GLOBAL_PAYMENT_DTO.increase.messageMustBePositive })
        .transform(MonetaryValue.toFixed)
        .transform(MonetaryValue.toCents)
        .default(GLOBAL_PAYMENT_DTO.increase.default),
    paidAt: z
        .coerce
        .date()
        .nullish()
        .transform(date => date || GLOBAL_PAYMENT_DTO.paidAt.default())
        .refine(date => date <= new Date(Date.now()), { message: GLOBAL_PAYMENT_DTO.paidAt.messagePaidAtHigherCurrentDate }),
})
    .refine(({ discount, increase, valuePaid }) => discount > 0 || increase > 0 || valuePaid > 0, { message: GLOBAL_PAYMENT_DTO.super.messageNoValue })
    .transform(({ discount, increase, ...rest }) => {
        const originDiscount = discount

        discount -= increase
        increase -= originDiscount

        return { ...rest, discount: Math.max(discount, 0), increase: Math.max(increase, 0) }
    })

export type PaymentCreateDTOArgs = z.input<typeof schemaCreate>

export async function create(args: PaymentCreateDTOArgs) {
    const { financialTransactionId, bankAccountId, observation, valuePaid, discount, increase, paidAt } = Validator.parseFilterNoSafe(args, schemaCreate)

    const financialTransaction = await financialTransactionRepository.findUniqueOrThrow({
        where: { id: financialTransactionId, bankAccountId },
        include: { payments: true }
    })

    if (!isSituationHasAllowedToCreatePayment(financialTransaction.situation))
        throw new BadRequestException({ title: 'Valid Financial Transaction', message: 'Financial transaction status does not allow new payments to be recorded' })

    const compensationPayment = new CompensationPaymentManager(
        financialTransaction,
        financialTransaction.payments
    )

    const isValidPayment = compensationPayment.validatePayment({ valuePaid, discount, increase })

    if (!isValidPayment.ok)
        throw new BadRequestException({ title: 'Valid Payment', message: isValidPayment.message })

    const transaction = await Transaction.begin()

    try {
        await paymentRepository.create({
            data: {
                financialTransactionId,
                valuePaid,
                discount,
                increase,
                observation,
                paidAt,
            }
        })

        await financialTransactionRepository.update({
            data: { situation: getNewSituation(isValidPayment.isComplete, financialTransaction.type) },
            where: { id: financialTransactionId, bankAccountId },
        })

        await updateBalance({
            bankAccountId,
            operation: financialTransaction.type,
            value: MonetaryValue.toReal(valuePaid)
        })

        await transaction.commit()
    } catch (err) {
        await transaction.rollback()
        throw err
    }

    return { message: 'Payment registered successfully' }
}

function getNewSituation(isComplete: boolean, type: FinancialTransactionModel.Type) {
    if (isComplete) {
        if (type == FinancialTransactionModel.Type.INCOME) {
            return FinancialTransactionModel.Situation.RECEIVED
        }
        return FinancialTransactionModel.Situation.PAID_OUT
    }
    if (type == FinancialTransactionModel.Type.INCOME) {
        return FinancialTransactionModel.Situation.PARTIALLY_RECEIVED
    }
    return FinancialTransactionModel.Situation.PARTIALLY_PAID
}