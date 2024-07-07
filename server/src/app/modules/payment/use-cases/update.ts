import { DTO } from '@util/dto'
import { Validator, z } from '@services/validator'
import { PaymentModel } from '@modules/payment/model'
import { GLOBAL_PAYMENT_DTO } from '@modules/payment/global'
import { GLOBAL_BANK_ACCOUNT_DTO } from '@modules/bank-account/global'

const { paymentRepository } = PaymentModel

const schemaUpdate = z.object({
    id: GLOBAL_PAYMENT_DTO.id,
    bankAccountId: GLOBAL_BANK_ACCOUNT_DTO.id,
    observation: z
        .string()
        .trim()
        .nullish()
        .transform(DTO.text.transformOptional),
})

export type PaymentUpdateDTOArgs = z.input<typeof schemaUpdate>

export async function update(args: PaymentUpdateDTOArgs) {
    const { id, bankAccountId, observation } = Validator.parseFilterNoSafe(args, schemaUpdate)

    await paymentRepository.checkExistsOrTrow({ where: { id, financialTransaction: { bankAccountId } } })

    await paymentRepository.update({
        data: { observation },
        where: { id }
    })

    return { message: 'Payment updated successfully' }
}