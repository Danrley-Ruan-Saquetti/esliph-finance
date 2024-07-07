import { DTO } from '@util/dto'
import { Validator, z } from '@services/validator'
import { MonetaryValue } from '@services/monetary-value'
import { FinancialTransactionModel } from '@modules/financial-transaction/model'
import { CompensationPaymentManager } from '@modules/payment/financial-transaction/manager/compensation-payment'

const { financialTransactionRepository } = FinancialTransactionModel

const schemaView = z.object({
    id: DTO.id.schema({ name: 'id' }),
    bankAccountId: DTO.id.schema({ name: 'Bank Account' }),
})

export type FinancialTransactionViewDTOArgs = z.input<typeof schemaView>

export async function view(args: FinancialTransactionViewDTOArgs) {
    const { id, bankAccountId } = Validator.parseNoSafe(args, schemaView)

    const { categories, payments, notes, ...financialTransaction } = await financialTransactionRepository.findUniqueOrThrow({
        where: { id, bankAccountId },
        select: {
            id: true,
            title: true,
            value: true,
            type: true,
            description: true,
            situation: true,
            dateTimeCompetence: true,
            typeOccurrence: true,
            expiresIn: true,
            updatedAt: true,
            isSendNotification: true,
            bankAccountId: true,
            frequency: true,
            isObservable: true,
            senderRecipient: true,
            timesToRepeat: true,
            createdAt: true,
            payments: true,
            categories: {
                select: {
                    category: true
                },
                orderBy: [
                    { category: { isFavorite: 'desc' } },
                    { category: { id: 'desc' } },
                ]
            },
            notes: {
                select: {
                    id: true,
                    updatedAt: true,
                    note: {
                        select: {
                            description: true,
                            createdAt: true,
                        }
                    }
                },
                orderBy: { note: { id: 'desc' } }
            }
        }
    })

    return {
        ...financialTransaction,
        value: MonetaryValue.toReal(financialTransaction.value),
        categories: categories.map(({ category }) => category),
        notes: notes.map(note => ({
            id: note.id,
            description: note.note.description,
            createdAt: note.note.createdAt,
            updatedAt: note.updatedAt,
        })),
        compensation: new CompensationPaymentManager(financialTransaction, payments).getPaymentStatementInReal(),
    }
}
