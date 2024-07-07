import { Validator, z } from '@services/validator'
import { GLOBAL_NOTE_DTO } from '@modules/note/global'
import { GLOBAL_BANK_ACCOUNT_DTO } from '@modules/bank-account/global'
import { FinancialTransactionNoteModel } from '@modules/note/financial-transaction/model'
import { GLOBAL_FINANCIAL_TRANSACTION_DTO } from '@modules/financial-transaction/global'

const { financialTransactionNoteRepository } = FinancialTransactionNoteModel

const viewSchema = z.object({
    id: GLOBAL_NOTE_DTO.id,
    financialTransactionId: GLOBAL_FINANCIAL_TRANSACTION_DTO.id,
    bankAccountId: GLOBAL_BANK_ACCOUNT_DTO.id,
})

export type FinancialTransactionNoteViewDTOArgs = z.input<typeof viewSchema>

export async function view(args: FinancialTransactionNoteViewDTOArgs) {
    const { id, financialTransactionId, bankAccountId } = Validator.parseNoSafe(args, viewSchema)

    const note = await financialTransactionNoteRepository.findUniqueOrThrow({
        where: { id, financialTransaction: { id: financialTransactionId, bankAccountId } },
        select: {
            id: true,
            updatedAt: true,
            note: {
                select: {
                    description: true,
                    createdAt: true
                }
            }
        }
    })

    return {
        id: note.id,
        description: note.note.description,
        updatedIAt: note.updatedAt,
        createdAt: note.note.createdAt,
    }
}