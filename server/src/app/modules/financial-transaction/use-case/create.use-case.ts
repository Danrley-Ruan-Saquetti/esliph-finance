import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { BadRequestException } from '@common/exceptions'
import { UseCase } from '@common/use-case'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { GLOBAL_FINANCIAL_TRANSACTION_DTO } from '../financial-transaction.global'
import { FinancialTransactionModel } from '../financial-transaction.model'

const schemaDTO = ValidatorService.schema.object({
    bankAccountId: GLOBAL_FINANCIAL_TRANSACTION_DTO.bankAccount.id,
    title: ValidatorService.schema.string().trim().min(1, { message: GLOBAL_FINANCIAL_TRANSACTION_DTO.title.messageRequired }),
    description: ValidatorService.schema.string().trim().default(GLOBAL_FINANCIAL_TRANSACTION_DTO.description.default),
    value: ValidatorService.schema.coerce.number().positive({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.value.messageMustBePositive }),
    priority: ValidatorService.schema.coerce.number().positive({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.priority.messageMustBePositive }),
    isObservable: ValidatorService.schema.boolean().default(GLOBAL_FINANCIAL_TRANSACTION_DTO.isObservable.default),
    isSendNotification: ValidatorService.schema.boolean().default(GLOBAL_FINANCIAL_TRANSACTION_DTO.isSendNotification.default),
    timesToRepeat: ValidatorService.schema.number().default(GLOBAL_FINANCIAL_TRANSACTION_DTO.timesToRepeat.default),
    type: ValidatorService.schema.enum([FinancialTransactionModel.Type.EXPENSE, FinancialTransactionModel.Type.INCOME], { 'invalid_type_error': GLOBAL_FINANCIAL_TRANSACTION_DTO.type.messageEnumInvalid }),
    typeOccurrence: ValidatorService.schema.enum([FinancialTransactionModel.TypeOccurrence.SINGLE, FinancialTransactionModel.TypeOccurrence.PROGRAMMATIC], { 'invalid_type_error': GLOBAL_FINANCIAL_TRANSACTION_DTO.type.messageEnumInvalid }),
    receiver: ValidatorService.schema.string().trim().default(GLOBAL_FINANCIAL_TRANSACTION_DTO.receiver.default),
    sender: ValidatorService.schema.string().trim().default(GLOBAL_FINANCIAL_TRANSACTION_DTO.sender.default),
    expiresIn: ValidatorService.schema.date().default(GLOBAL_FINANCIAL_TRANSACTION_DTO.expiresIn.default()),
}).refine(({ receiver, sender }) => receiver || sender, { message: GLOBAL_FINANCIAL_TRANSACTION_DTO.super.messageSenderAndReceiverNotEmpty })

export type FinancialTransactionCreateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'financial-transaction.use-case.create' })
export class FinancialTransactionCreateUseCase extends UseCase {
    constructor(@Injection.Inject('financial-transaction.repository') private repository: FinancialTransactionRepository) {
        super()
    }

    async perform(args: FinancialTransactionCreateDTOArgs) {
        const data = this.validateDTO(args, schemaDTO)

        // await this.registerFinancialTransaction(data)

        return Result.success({ message: 'Register financial transaction successfully' })
    }

    private async registerFinancialTransaction(data: FinancialTransactionCreateDTOArgs) {
        const registerFinancialTransactionResult = await this.repository.register({
            bankAccountId: data.bankAccountId, countRepeatedOccurrences: data.countRepeatedOccurrences, description: data.description, expiresIn: data.expiresIn, isObservable: data.isObservable, isSendNotification: data.isSendNotification, priority: data.priority, receiver: data.receiver, sender: data.sender, situation: data.situation, timesToRepeat: data.timesToRepeat, title: data.title, type: data.type, typeOccurrence: data.typeOccurrence, value: data.value
        })

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
