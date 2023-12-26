import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { BadRequestException } from '@common/exceptions'
import { UseCase } from '@common/use-case'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { GLOBAL_FINANCIAL_TRANSACTION_DTO } from '@modules/financial-transaction/financial-transaction.global'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'

const schemaDTO = ValidatorService.schema.object({
    bankAccountId: GLOBAL_FINANCIAL_TRANSACTION_DTO.bankAccount.id,
    title: ValidatorService.schema
        .string({ 'required_error': GLOBAL_FINANCIAL_TRANSACTION_DTO.title.messageRequired })
        .trim()
        .min(GLOBAL_FINANCIAL_TRANSACTION_DTO.title.minCharacters, { message: GLOBAL_FINANCIAL_TRANSACTION_DTO.title.messageMinCharacters }),
    description: ValidatorService.schema
        .string()
        .trim()
        .default(GLOBAL_FINANCIAL_TRANSACTION_DTO.description.default),
    value: ValidatorService
        .schema
        .coerce
        .number({ 'required_error': GLOBAL_FINANCIAL_TRANSACTION_DTO.value.messageRequired, 'invalid_type_error': GLOBAL_FINANCIAL_TRANSACTION_DTO.value.messageMustBePositive })
        .positive({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.value.messageMustBePositive }),
    priority: ValidatorService
        .schema
        .coerce
        .number({
            'required_error': GLOBAL_FINANCIAL_TRANSACTION_DTO.priority.messageRequired,
            'invalid_type_error': GLOBAL_FINANCIAL_TRANSACTION_DTO.priority.messageMustBePositive
        })
        .nonnegative({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.priority.messageMustBePositive }),
    isObservable: ValidatorService
        .schema
        .boolean()
        .default(GLOBAL_FINANCIAL_TRANSACTION_DTO.isObservable.default),
    isSendNotification: ValidatorService
        .schema
        .boolean()
        .default(GLOBAL_FINANCIAL_TRANSACTION_DTO.isSendNotification.default),
    timesToRepeat: ValidatorService
        .schema
        .number()
        .default(GLOBAL_FINANCIAL_TRANSACTION_DTO.timesToRepeat.default),
    type: ValidatorService
        .schema
        .enum(
            [FinancialTransactionModel.Type.EXPENSE, FinancialTransactionModel.Type.INCOME],
            { errorMap: () => ({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.type.messageEnumInvalid }) }
        )
        .transform(val => val.toUpperCase()),
    typeOccurrence: ValidatorService
        .schema
        .enum(
            [FinancialTransactionModel.TypeOccurrence.SINGLE, FinancialTransactionModel.TypeOccurrence.PROGRAMMATIC],
            { errorMap: () => ({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.typeOccurrence.messageEnumInvalid }) }
        ),
    receiver: ValidatorService
        .schema
        .string()
        .trim()
        .default(GLOBAL_FINANCIAL_TRANSACTION_DTO.receiver.default),
    sender: ValidatorService
        .schema
        .string()
        .trim()
        .default(GLOBAL_FINANCIAL_TRANSACTION_DTO.sender.default),
    expiresIn: ValidatorService
        .schema
        .date()
        .default(GLOBAL_FINANCIAL_TRANSACTION_DTO.expiresIn.default()),
})
    .refine(
        ({ type, receiver }) => type != FinancialTransactionModel.Type.EXPENSE || !!receiver,
        { message: GLOBAL_FINANCIAL_TRANSACTION_DTO.receiver.messageRequired, path: ['receiver'] }
    )
    .refine(
        ({ type, sender }) => type != FinancialTransactionModel.Type.INCOME || !!sender,
        { message: GLOBAL_FINANCIAL_TRANSACTION_DTO.sender.messageRequired, path: ['sender'] }
    )
    .refine(
        ({ typeOccurrence, timesToRepeat }) => typeOccurrence != FinancialTransactionModel.TypeOccurrence.PROGRAMMATIC || !!timesToRepeat,
        { message: GLOBAL_FINANCIAL_TRANSACTION_DTO.timesToRepeat.messageMustBePositive, path: ['timesToRepeat'] }
    )

export type FinancialTransactionCreateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'financial-transaction.use-case.create' })
export class FinancialTransactionCreateUseCase extends UseCase {
    constructor(@Injection.Inject('financial-transaction.repository') private repository: FinancialTransactionRepository) {
        super()
    }

    async perform(args: FinancialTransactionCreateDTOArgs) {
        const data = this.validateDTO(args, schemaDTO)

        const processData = this.processingData(data)
        await this.registerFinancialTransaction(processData)

        return Result.success({ message: 'Register financial transaction successfully' })
    }

    private processingData(data: SchemaValidator.output<typeof schemaDTO>): FinancialTransactionModel.Model {
        return {
            bankAccountId: data.bankAccountId,
            value: data.value,
            description: data.description,
            expiresIn: data.expiresIn,
            isObservable: !!data.isObservable,
            isSendNotification: !!data.isSendNotification,
            priority: data.priority,
            receiver: data.type == FinancialTransactionModel.Type.EXPENSE ? data.receiver : '',
            sender: data.type == FinancialTransactionModel.Type.INCOME ? data.sender : '',
            situation: FinancialTransactionModel.Situation.PENDING,
            countRepeatedOccurrences: 0,
            timesToRepeat: data.typeOccurrence === FinancialTransactionModel.TypeOccurrence.PROGRAMMATIC ? data.timesToRepeat : 0,
            title: data.title,
            type: FinancialTransactionModel.Type[data.type],
            typeOccurrence: data.typeOccurrence,
        }
    }

    private async registerFinancialTransaction(data: FinancialTransactionModel.Model) {
        const registerFinancialTransactionResult = await this.repository.register(data)

        if (registerFinancialTransactionResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...registerFinancialTransactionResult.getError(),
            title: 'Register FinancialTransaction',
            message: `Unable to register financial transaction. Error: "${registerFinancialTransactionResult.getError().message}". Please, try again later`,
        })
    }
}
