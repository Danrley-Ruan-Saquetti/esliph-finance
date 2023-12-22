import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { BadRequestException } from '@common/exceptions'
import { UseCase } from '@common/use-case'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { GLOBAL_FINANCIAL_TRANSACTION_DTO } from '../financial-transaction.global'

/*
bankAccountId: number;
title: string;
description: string;
value: number;
priority: number;
isObservable: boolean;
isSendNotification: boolean;
timesToRepeat: number;
type: $Enums.FinancialTransactionType;
receiver: string;
sender: string;
typeOccurrence: $Enums.FinancialTransactionTypeOccurrence;
expiresIn: Date;
*/

const schemaDTO = ValidatorService.schema.object({
    bankAccount: GLOBAL_FINANCIAL_TRANSACTION_DTO.bankAccount.id,
    title: ValidatorService.schema.string().trim().min(1, { message: GLOBAL_FINANCIAL_TRANSACTION_DTO.title.messageRequired }),
    description: ValidatorService.schema.string().trim().default(GLOBAL_FINANCIAL_TRANSACTION_DTO.description.default),
    value: ValidatorService.schema.string().trim(),
    priority: ValidatorService.schema.string().trim(),
    isObservable: ValidatorService.schema.string().trim(),
    isSendNotification: ValidatorService.schema.string().trim(),
    timesToRepeat: ValidatorService.schema.string().trim(),
    receiver: ValidatorService.schema.string().trim(),
    sender: ValidatorService.schema.string().trim(),
    expiresIn: ValidatorService.schema.string().trim(),
})

export type FinancialTransactionCreateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'financial-transaction.use-case.create' })
export class FinancialTransactionCreateUseCase extends UseCase {
    constructor(@Injection.Inject('financial-transaction.repository') private repository: FinancialTransactionRepository) {
        super()
    }

    async perform(args: FinancialTransactionCreateDTOArgs) {
        const {} = this.validateDTO(args, schemaDTO)

        await this.registerFinancialTransaction({})

        return Result.success({ message: 'Register financial transaction successfully' })
    }

    private async registerFinancialTransaction({}: FinancialTransactionCreateDTOArgs) {
        const registerFinancialTransactionResult = await this.repository.register({})

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
