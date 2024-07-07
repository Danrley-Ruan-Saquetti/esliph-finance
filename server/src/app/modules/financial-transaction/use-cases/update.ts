import { DTO } from '@util/dto'
import { isUndefined } from '@util/types'
import { Transaction } from '@services/database'
import { Validator, z } from '@services/validator'
import { NoteModel } from '@modules/note/model'
import { CategoryModel } from '@modules/category/model'
import { GLOBAL_NOTE_DTO } from '@modules/note/global'
import { FinancialTransactionModel } from '@modules/financial-transaction/model'
import { GLOBAL_FINANCIAL_TRANSACTION_DTO } from '@modules/financial-transaction/global'

const { financialTransactionRepository } = FinancialTransactionModel
const { categoryRepository } = CategoryModel
const { noteRepository } = NoteModel

const schemaUpdate = z.object({
    id: GLOBAL_FINANCIAL_TRANSACTION_DTO.id,
    bankAccountId: GLOBAL_FINANCIAL_TRANSACTION_DTO.bankAccount.id,
    title: z
        .string({ 'required_error': GLOBAL_FINANCIAL_TRANSACTION_DTO.title.messageRequired })
        .trim()
        .min(GLOBAL_FINANCIAL_TRANSACTION_DTO.title.minCharacters, { message: GLOBAL_FINANCIAL_TRANSACTION_DTO.title.messageRangeCharacters })
        .max(GLOBAL_FINANCIAL_TRANSACTION_DTO.title.maxCharacters, { message: GLOBAL_FINANCIAL_TRANSACTION_DTO.title.messageRangeCharacters })
        .optional(),
    description: z
        .string()
        .trim()
        .nullish()
        .transform(val => val || ''),
    isObservable: z
        .boolean()
        .optional(),
    isSendNotification: z
        .boolean()
        .optional(),
    typeOccurrence: z
        .enum(GLOBAL_FINANCIAL_TRANSACTION_DTO.typeOccurrence.enum, {
            errorMap: () => ({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.typeOccurrence.messageEnumInvalid }),
        })
        .optional(),
    timesToRepeat: z
        .number()
        .int()
        .nonnegative({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.timesToRepeat.messageMustBePositive })
        .nullish()
        .transform(DTO.number.transformOptional),
    senderRecipient: z
        .string()
        .trim()
        .optional(),
    expiresIn: z
        .coerce
        .date()
        .nullish(),
    dateTimeCompetence: z
        .coerce
        .date()
        .nullish()
        .transform(DTO.date.transformOptional),
    categories: DTO.relationEntities.schema({ name: 'Categories' }),
    notes: z
        .object({
            create: z
                .array(z
                    .string())
                .default([]),
            remove: DTO.id.arraySchema({ name: 'Notes' }),
            update: z
                .array(z
                    .object({
                        id: GLOBAL_NOTE_DTO.id,
                        description: z
                            .string()
                            .nullish()
                    }))
                .default([])
                .transform(val =>
                    val
                        .filter(({ description }) => !isUndefined(description))
                        .map(({ id, description }) => ({ id, description: description || '' }))),
        })
        .default({})
        .transform(({ create, remove, update }) => {
            if (!remove.length || !update.length) return { create, remove: remove, update }

            for (let i = 0; i < remove.length; i++) {
                const index = update.findIndex(note => remove[i] == note.id)

                if (index < 0) continue

                update = update.slice(index, 0)
            }

            return { create, remove: remove, update }
        })
})
    .transform(({ expiresIn, typeOccurrence, timesToRepeat, ...rest }) => {
        let situation: FinancialTransactionModel.Situation | undefined = undefined

        if (expiresIn && new Date(Date.now()) < expiresIn)
            situation = FinancialTransactionModel.Situation.LATE

        if (typeOccurrence == FinancialTransactionModel.TypeOccurrence.SINGLE)
            timesToRepeat = 0

        return { ...rest, situation, typeOccurrence, timesToRepeat }
    })

export type FinancialTransactionUpdateDTOArgs = z.input<typeof schemaUpdate>

export async function update(args: FinancialTransactionUpdateDTOArgs) {
    const dto = Validator.parseNoSafe(args, schemaUpdate)

    const financialTransaction = await financialTransactionRepository.findUniqueOrThrow({ where: { id: dto.id, bankAccountId: dto.bankAccountId } })

    if (dto.typeOccurrence && dto.typeOccurrence != financialTransaction.typeOccurrence) {
        if (dto.typeOccurrence == FinancialTransactionModel.TypeOccurrence.SINGLE)
            dto.timesToRepeat = 0
        else if (!dto.timesToRepeat)
            dto.typeOccurrence = undefined
    }
    else {
        dto.typeOccurrence = undefined
        dto.timesToRepeat = undefined
    }

    if (dto.categories.link.length) {
        const categories = await categoryRepository.findMany({
            where: { id: { in: dto.categories.link } },
            select: { id: true }
        })

        if (categories)
            dto.categories.link = categories.map(({ id }) => id)
    }

    if (dto.categories.unlink.length) {
        const categories = await categoryRepository.findMany({
            where: { id: { in: dto.categories.unlink } },
            select: { id: true }
        })

        if (categories)
            dto.categories.unlink = categories.map(({ id }) => id)
    }

    const transaction = await Transaction.begin()

    try {
        await financialTransactionRepository.update({
            data: {
                situation: dto.situation,
                id: dto.id,
                title: dto.title,
                description: dto.description,
                isObservable: dto.isObservable,
                isSendNotification: dto.isSendNotification,
                typeOccurrence: dto.typeOccurrence,
                timesToRepeat: dto.timesToRepeat,
                senderRecipient: dto.senderRecipient,
                dateTimeCompetence: dto.dateTimeCompetence,
                categories: {
                    createMany: {
                        data: dto.categories.link.map(categoryId => ({ categoryId })),
                        skipDuplicates: true,
                    },
                    deleteMany: { categoryId: { in: dto.categories.unlink } },
                },
                notes: {
                    create: dto.notes.create.map(note => ({
                        note: { create: { description: note } }
                    })),
                    deleteMany: { id: { in: dto.notes.remove } }
                }
            },
            where: { id: dto.id }
        })

        for (let i = 0; i < dto.notes.update.length; i++) {
            await noteRepository.update({
                data: { description: dto.notes.update[i].description },
                where: { id: dto.notes.update[i].id }
            })
        }

        await transaction.commit()

        return { message: 'Financial transaction updated successfully' }
    } catch (err) {
        await transaction.rollback()
        throw err
    }
}