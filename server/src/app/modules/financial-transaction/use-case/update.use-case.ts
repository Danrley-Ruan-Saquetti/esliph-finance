import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { BadRequestException, UnauthorizedException } from '@common/exceptions'
import { GLOBAL_DTO } from '@global'
import { isUndefined } from '@util'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { GLOBAL_FINANCIAL_TRANSACTION_DTO, GLOBAL_FINANCIAL_TRANSACTION_RULES } from '@modules/financial-transaction/financial-transaction.global'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'

const schemaDTO = ValidatorService.schema.object({
    id: GLOBAL_FINANCIAL_TRANSACTION_DTO.id,
    title: ValidatorService.schema
        .string()
        .trim()
        .min(GLOBAL_FINANCIAL_TRANSACTION_DTO.title.minCharacters, { message: GLOBAL_FINANCIAL_TRANSACTION_DTO.title.messageRangeCharacters })
        .max(GLOBAL_FINANCIAL_TRANSACTION_DTO.title.maxCharacters, { message: GLOBAL_FINANCIAL_TRANSACTION_DTO.title.messageRangeCharacters })
        .optional(),
    description: ValidatorService.schema
        .string()
        .trim()
        .optional(),
    priority: ValidatorService
        .schema
        .coerce
        .number()
        .nonnegative({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.priority.messageMustBePositive })
        .optional(),
    isObservable: ValidatorService
        .schema
        .boolean()
        .optional(),
    isSendNotification: ValidatorService
        .schema
        .boolean()
        .optional(),
    timesToRepeat: ValidatorService
        .schema
        .number()
        .optional(),
    typeOccurrence: ValidatorService
        .schema
        .enum(
            GLOBAL_FINANCIAL_TRANSACTION_DTO.typeOccurrence.enum,
            { errorMap: () => ({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.typeOccurrence.messageEnumInvalid }) }
        )
        .optional(),
    situation: ValidatorService
        .schema
        .enum(
            GLOBAL_FINANCIAL_TRANSACTION_RULES.update.situationsEnableToUpdate.enum,
            { errorMap: () => ({ message: GLOBAL_FINANCIAL_TRANSACTION_RULES.update.situationsEnableToUpdate.messageInvalidSituationToUpdate }) }
        )
        .optional(),
    frequency: ValidatorService
        .schema
        .enum(
            GLOBAL_FINANCIAL_TRANSACTION_DTO.frequency.enum,
            { errorMap: () => ({ message: GLOBAL_FINANCIAL_TRANSACTION_DTO.frequency.messageEnumInvalid }) }
        )
        .optional(),
    receiver: ValidatorService
        .schema
        .string()
        .trim()
        .optional(),
    sender: ValidatorService
        .schema
        .string()
        .trim()
        .optional(),
    expiresIn: ValidatorService
        .schema
        .coerce
        .date()
        .transform(GLOBAL_DTO.date.transform)
        .optional(),
    dateTimeCompetence: ValidatorService
        .schema
        .coerce
        .date()
        .transform(GLOBAL_DTO.date.transform)
        .optional(),
})

export type FinancialTransactionUpdateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'financial-transaction.use-case.update' })
export class FinancialTransactionUpdateUseCase extends UseCase {
    constructor(@Injection.Inject('financial-transaction.repository') private repository: FinancialTransactionRepository) {
        super()
    }

    async perform(args: FinancialTransactionUpdateDTOArgs) {
        const dataDTO = this.validateDTO(args, schemaDTO)

        const financialTransaction = await this.verifyIsExistsFinancialTransaction(dataDTO.id)
        const dataToUpdate = this.processingData(dataDTO, financialTransaction)
        await this.update(dataToUpdate, dataDTO.id)

        return Result.success({ message: 'Financial transaction updated successfully' })
    }

    private async verifyIsExistsFinancialTransaction(id: ID) {
        const financialTransactionResult = await this.repository.findById(id)

        if (!financialTransactionResult.isSuccess()) {
            if (financialTransactionResult.isErrorInOperation()) {
                throw new BadRequestException({ title: 'Find Financial Transaction', message: `Unable to find financial transaction. Error "${financialTransactionResult.getError()}"` })
            }

            throw new BadRequestException({ title: 'Find Financial Transaction', message: 'Financial transaction not found' })
        }

        return financialTransactionResult.getValue()
    }

    private processingData(data: SchemaValidator.output<typeof schemaDTO>, original: FinancialTransactionModel.Model): FinancialTransactionModel.UpdateArgs {
        const isAlreadyLate = !data.expiresIn || this.dateService.now() < data.expiresIn
        const isProgrammatic = (!data.typeOccurrence && original.typeOccurrence === FinancialTransactionModel.TypeOccurrence.PROGRAMMATIC) || data.typeOccurrence === FinancialTransactionModel.TypeOccurrence.PROGRAMMATIC

        const dataTransactions: FinancialTransactionModel.UpdateArgs = {
            title: data.title,
            description: data.description,
            receiver: original.type == FinancialTransactionModel.Type.EXPENSE ? data.receiver : '',
            sender: original.type == FinancialTransactionModel.Type.INCOME ? data.sender : '',
            dateTimeCompetence: data.dateTimeCompetence,
            expiresIn: data.expiresIn,
            frequency: isProgrammatic ? data.frequency : undefined,
            isObservable: data.isObservable,
            isSendNotification: data.isSendNotification,
            priority: data.priority,
            situation: isAlreadyLate ? FinancialTransactionModel.Situation.CANCELED : data.situation,
            timesToRepeat: isProgrammatic ? data.timesToRepeat : undefined,
            typeOccurrence: data.typeOccurrence
        }

        return dataTransactions
    }

    private async update(data: FinancialTransactionModel.UpdateArgs, id: ID) {
        const updateResult = await this.repository.updateById(data, { id })

        if (updateResult.isSuccess()) {
            return
        }

        throw new BadRequestException({ title: 'Update Financial Transaction', message: `Unable to update financial transaction. Error "${updateResult.getError()}"` })
    }
}
