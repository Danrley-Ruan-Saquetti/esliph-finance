import { Result, Injection, Service } from '@core'
import { GLOBAL_DTO } from '@global'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { SchemaValidator } from '@services/validator.service'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { GLOBAL_FINANCIAL_TRANSACTION_DTO } from '@modules/financial-transaction/financial-transaction.global'
import { GLOBAL_NOTE_DTO } from '@modules/note/note.global'

const schemaDTO = SchemaValidator.object({
    bankAccountId: GLOBAL_FINANCIAL_TRANSACTION_DTO.bankAccount.id,
    title: SchemaValidator
        .string({ 'required_error': GLOBAL_FINANCIAL_TRANSACTION_DTO.title.messageRequired })
        .trim()
        .min(GLOBAL_FINANCIAL_TRANSACTION_DTO.title.minCharacters, { message: GLOBAL_FINANCIAL_TRANSACTION_DTO.title.messageRangeCharacters })
        .max(GLOBAL_FINANCIAL_TRANSACTION_DTO.title.maxCharacters, { message: GLOBAL_FINANCIAL_TRANSACTION_DTO.title.messageRangeCharacters }),
    description: SchemaValidator.string().trim().default(GLOBAL_FINANCIAL_TRANSACTION_DTO.description.default),
    value: SchemaValidator.coerce
        .number({
            'required_error': GLOBAL_FINANCIAL_TRANSACTION_DTO.value.messageRequired,
            'invalid_type_error': GLOBAL_FINANCIAL_TRANSACTION_DTO.value.messageMustBePositive,
        })
        .positive({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.value.messageMustBePositive }),
    priority: SchemaValidator.coerce
        .number({
            'required_error': GLOBAL_FINANCIAL_TRANSACTION_DTO.priority.messageRequired,
            'invalid_type_error': GLOBAL_FINANCIAL_TRANSACTION_DTO.priority.messageMustBePositive,
        })
        .nonnegative({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.priority.messageMustBePositive }),
    isObservable: SchemaValidator.boolean().default(GLOBAL_FINANCIAL_TRANSACTION_DTO.isObservable.default),
    isSendNotification: SchemaValidator.boolean().default(GLOBAL_FINANCIAL_TRANSACTION_DTO.isSendNotification.default),
    timesToRepeat: SchemaValidator.number().default(GLOBAL_FINANCIAL_TRANSACTION_DTO.timesToRepeat.default),
    type: SchemaValidator
        .enum(GLOBAL_FINANCIAL_TRANSACTION_DTO.type.enum, { errorMap: () => ({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.type.messageEnumInvalid }) })
        .transform(val => val.toUpperCase()),
    typeOccurrence: SchemaValidator.enum(GLOBAL_FINANCIAL_TRANSACTION_DTO.typeOccurrence.enum, {
        errorMap: () => ({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.typeOccurrence.messageEnumInvalid }),
    }),
    frequency: SchemaValidator
        .enum(GLOBAL_FINANCIAL_TRANSACTION_DTO.frequency.enum, {
            errorMap: () => ({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.frequency.messageEnumInvalid }),
        })
        .default(FinancialTransactionModel.Frequency.NULL),
    receiver: SchemaValidator.string().trim().default(GLOBAL_FINANCIAL_TRANSACTION_DTO.receiver.default),
    sender: SchemaValidator.string().trim().default(GLOBAL_FINANCIAL_TRANSACTION_DTO.sender.default),
    expiresIn: SchemaValidator.coerce.date().default(GLOBAL_FINANCIAL_TRANSACTION_DTO.expiresIn.default()).transform(GLOBAL_DTO.date.transform),
    dateTimeCompetence: SchemaValidator.coerce
        .date()
        .default(GLOBAL_FINANCIAL_TRANSACTION_DTO.dateTimeCompetence.default())
        .transform(GLOBAL_DTO.date.transform),
    notes: SchemaValidator
        .array(
            SchemaValidator.object({
                description: SchemaValidator
                    .string()
                    .trim()
                    .max(GLOBAL_NOTE_DTO.description.maxCharacters, { message: GLOBAL_NOTE_DTO.description.messageRangeCharacters })
                    .optional(),
            }),
        )
        .optional()
        .default([]),
    categories: SchemaValidator
        .array(
            SchemaValidator.coerce.number(),
        )
        .optional()
        .default([]),
})
    .refine(({ typeOccurrence, timesToRepeat }) => typeOccurrence != FinancialTransactionModel.TypeOccurrence.PROGRAMMATIC || !!timesToRepeat, {
        message: GLOBAL_FINANCIAL_TRANSACTION_DTO.timesToRepeat.messageMustBePositive,
        path: ['timesToRepeat'],
    })
    .refine(
        ({ typeOccurrence, frequency }) => typeOccurrence != FinancialTransactionModel.TypeOccurrence.PROGRAMMATIC || (!!frequency && frequency != FinancialTransactionModel.Frequency.NULL),
        { message: GLOBAL_FINANCIAL_TRANSACTION_DTO.frequency.messageEnumInvalid, path: ['frequency'] },
    )

export type FinancialTransactionCreateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'financial-transaction.use-case.create' })
export class FinancialTransactionCreateUseCase extends UseCase {
    constructor(@Injection.Inject('financial-transaction.repository') private transactionRepository: FinancialTransactionRepository) {
        super()
    }

    async perform(args: FinancialTransactionCreateDTOArgs) {
        const data = this.validateDTO(args, schemaDTO)

        const { financialTransaction, notes, categories } = this.processingData(data)
        await this.registerFinancialTransaction(financialTransaction, notes, categories)

        return Result.success({ message: 'Register financial transaction successfully' })
    }

    private processingData(data: SchemaValidator.output<typeof schemaDTO>): {
        financialTransaction: FinancialTransactionModel.Model
        notes: { description: string }[]
        categories: { id: number }[]
    } {
        const isAlreadyLate = this.dateService.now() < data.expiresIn
        const isProgrammatic = data.typeOccurrence === FinancialTransactionModel.TypeOccurrence.PROGRAMMATIC

        return {
            financialTransaction: {
                bankAccountId: data.bankAccountId,
                title: data.title,
                description: data.description,
                value: data.value,
                situation: isAlreadyLate ? FinancialTransactionModel.Situation.LATE : FinancialTransactionModel.Situation.PENDING,
                type: FinancialTransactionModel.Type[data.type],
                dateTimeCompetence: this.dateService.converterToUTC(data.dateTimeCompetence),
                expiresIn: this.dateService.converterToUTC(data.expiresIn),
                receiver: data.receiver || '',
                sender: data.sender || '',
                isObservable: !!data.isObservable,
                isSendNotification: !!data.isSendNotification,
                priority: data.priority,
                typeOccurrence: data.typeOccurrence,
                timesToRepeat: isProgrammatic ? data.timesToRepeat : 0,
                countRepeatedOccurrences: 0,
                frequency: isProgrammatic ? data.frequency : FinancialTransactionModel.Frequency.NULL,
            },
            notes: data.notes.filter(note => !!note.description) as { description: string }[],
            categories: data.categories.map(id => ({ id }))
        }
    }

    private async registerFinancialTransaction(data: FinancialTransactionModel.Model, notes: { description: string }[] = [], categories: { id: number }[] = []) {
        const registerFinancialTransactionResult = await this.transactionRepository.create({
            data: {
                title: data.title,
                description: data.description,
                value: data.value,
                situation: data.situation,
                type: data.type,
                dateTimeCompetence: data.dateTimeCompetence,
                expiresIn: data.expiresIn,
                receiver: data.receiver,
                sender: data.sender,
                isObservable: data.isObservable,
                isSendNotification: data.isSendNotification,
                priority: data.priority,
                typeOccurrence: data.typeOccurrence,
                timesToRepeat: data.timesToRepeat,
                countRepeatedOccurrences: data.countRepeatedOccurrences,
                frequency: data.frequency,
                bankAccount: {
                    connect: { id: data.bankAccountId }
                },
                ...(notes.length && {
                    notes: {
                        createMany: { data: notes }
                    }
                }),
                ...(categories.length && {
                    categories: {
                        createMany: { data: categories.map(({ id }) => ({ categoryId: id })) }
                    }
                })
            }
        })

        if (registerFinancialTransactionResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...registerFinancialTransactionResult.getError(),
            title: 'Register Financial Transaction',
        })
    }
}
