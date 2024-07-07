import { DTO } from '@util/dto'
import { isNumber } from '@util/types'
import { Validator, z } from '@services/validator'
import { MonetaryValue } from '@services/monetary-value'
import { CategoryModel } from '@modules/category/model'
import { BankAccountModel } from '@modules/bank-account/model'
import { FinancialTransactionModel } from '@modules/financial-transaction/model'
import { GLOBAL_FINANCIAL_TRANSACTION_DTO } from '@modules/financial-transaction/global'

const { bankAccountRepository } = BankAccountModel
const { financialTransactionRepository } = FinancialTransactionModel
const { categoryRepository } = CategoryModel

const schemaCreate = z.object({
    bankAccountId: GLOBAL_FINANCIAL_TRANSACTION_DTO.bankAccount.id,
    title: z
        .string({ 'required_error': GLOBAL_FINANCIAL_TRANSACTION_DTO.title.messageRequired })
        .trim()
        .min(GLOBAL_FINANCIAL_TRANSACTION_DTO.title.minCharacters, { message: GLOBAL_FINANCIAL_TRANSACTION_DTO.title.messageRangeCharacters })
        .max(GLOBAL_FINANCIAL_TRANSACTION_DTO.title.maxCharacters, { message: GLOBAL_FINANCIAL_TRANSACTION_DTO.title.messageRangeCharacters }),
    description: z
        .string()
        .trim()
        .default(GLOBAL_FINANCIAL_TRANSACTION_DTO.description.default),
    value: z.coerce
        .number({
            'required_error': GLOBAL_FINANCIAL_TRANSACTION_DTO.value.messageRequired,
            'invalid_type_error': GLOBAL_FINANCIAL_TRANSACTION_DTO.value.messageMustBePositive,
        })
        .positive({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.value.messageMustBePositive })
        .transform(MonetaryValue.toCents),
    isObservable: z
        .boolean()
        .default(GLOBAL_FINANCIAL_TRANSACTION_DTO.isObservable.default),
    isSendNotification: z
        .boolean()
        .default(GLOBAL_FINANCIAL_TRANSACTION_DTO.isSendNotification.default),
    timesToRepeat: z
        .number()
        .int()
        .nullish()
        .default(GLOBAL_FINANCIAL_TRANSACTION_DTO.timesToRepeat.default)
        .transform(DTO.number.transformOptional),
    type: z
        .enum(GLOBAL_FINANCIAL_TRANSACTION_DTO.type.enum, { errorMap: () => ({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.type.messageEnumInvalid }) })
        .transform(val => val.toUpperCase()),
    typeOccurrence: z
        .enum(GLOBAL_FINANCIAL_TRANSACTION_DTO.typeOccurrence.enum, {
            errorMap: () => ({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.typeOccurrence.messageEnumInvalid }),
        })
        .default(GLOBAL_FINANCIAL_TRANSACTION_DTO.typeOccurrence.default),
    frequency: z
        .enum(GLOBAL_FINANCIAL_TRANSACTION_DTO.frequency.enum, {
            errorMap: () => ({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.frequency.messageEnumInvalid }),
        })
        .optional(),
    senderRecipient: z
        .string()
        .trim()
        .default(GLOBAL_FINANCIAL_TRANSACTION_DTO.senderRecipient.default),
    expiresIn: z
        .coerce
        .date()
        .nullish()
        .transform(DTO.date.transformOptional),
    dateTimeCompetence: z.coerce
        .date()
        .nullish()
        .transform(date => DTO.date.transform(date || GLOBAL_FINANCIAL_TRANSACTION_DTO.dateTimeCompetence.default())),
    categories: DTO.id.arraySchema({ name: 'Categories' }),
    notes: z.array(z.string()).default([])
})
    .transform(({ typeOccurrence, timesToRepeat, expiresIn, ...rest }) => {
        if (isNumber(timesToRepeat))
            typeOccurrence = timesToRepeat > 0 ? FinancialTransactionModel.TypeOccurrence.PROGRAMMATIC : FinancialTransactionModel.TypeOccurrence.SINGLE
        else
            timesToRepeat = typeOccurrence == FinancialTransactionModel.TypeOccurrence.SINGLE ? 0 : timesToRepeat

        return { ...rest, typeOccurrence, timesToRepeat, expiresIn, situation: expiresIn && new Date(Date.now()) < expiresIn ? FinancialTransactionModel.Situation.LATE : FinancialTransactionModel.Situation.PENDING }
    })
    .refine(({ typeOccurrence, timesToRepeat }) => typeOccurrence != FinancialTransactionModel.TypeOccurrence.PROGRAMMATIC || !!timesToRepeat, {
        message: GLOBAL_FINANCIAL_TRANSACTION_DTO.timesToRepeat.messageMustBePositive,
        path: ['timesToRepeat'],
    })
    .refine(
        ({ typeOccurrence, frequency }) => typeOccurrence != FinancialTransactionModel.TypeOccurrence.PROGRAMMATIC || (!!frequency && frequency != null),
        { message: GLOBAL_FINANCIAL_TRANSACTION_DTO.frequency.messageEnumInvalid, path: ['frequency'] },
    )

export type FinancialTransactionCreateDTOArgs = z.input<typeof schemaCreate>

export async function create(args: FinancialTransactionCreateDTOArgs) {
    const dto = Validator.parseNoSafe(args, schemaCreate)

    await bankAccountRepository.checkExistsOrTrow({ where: { id: dto.bankAccountId } })

    if (dto.categories.length) {
        const categories = await categoryRepository.findMany({
            where: { id: { in: dto.categories } },
            select: { id: true }
        })

        if (categories)
            dto.categories = categories.map(({ id }) => id)
    }

    await financialTransactionRepository.create({
        data: {
            ...dto as any,
            notes: {
                create: dto.notes.map(note => ({
                    note: {
                        create: { description: note }
                    }
                }))
            },
            categories: {
                createMany: {
                    data: dto.categories.map(categoryId => ({ categoryId })),
                    skipDuplicates: true
                }
            },
        }
    })

    return { message: 'Financial transaction created successfully' }
}