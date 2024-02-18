import { Injection, Service } from '@core'
import { UseCase } from '@common/use-case'
import { SchemaValidator } from '@services/validator.service'
import { GLOBAL_FINANCIAL_TRANSACTION_DTO } from '@modules/financial-transaction/financial-transaction.global'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'
import { FinancialTransactionCreateDTOArgs, FinancialTransactionCreateUseCase } from '@modules/financial-transaction/use-case/create.use-case'

const schemaDTO = SchemaValidator.object({
    sender: SchemaValidator
        .string({ 'required_error': GLOBAL_FINANCIAL_TRANSACTION_DTO.sender.messageRequired })
        .trim()
})

export type FinancialIncomeCreateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'financial-income.use-case.create' })
export class FinancialIncomeCreateUseCase extends UseCase {
    constructor(@Injection.Inject('financial-transaction.use-case.create') private createUC: FinancialTransactionCreateUseCase) {
        super()
    }

    async perform(args: FinancialTransactionCreateDTOArgs & FinancialIncomeCreateDTOArgs) {
        const data = this.validateDTO(args, schemaDTO)

        const result = await this.createUC.perform({ ...args, ...data, type: FinancialTransactionModel.Type.INCOME, receiver: '' })

        return result
    }
}
