import { ID } from '@@types'
import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { PaymentRepository } from '@modules/payment/payment.repository'
import { GLOBAL_PAYMENT_DTO } from '@modules/payment/payment.global'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'

const schemaDTO = ValidatorService.schema.object({
    financialTransactionId: GLOBAL_PAYMENT_DTO.financialTransaction.id
})

export type PaymentQueryCompensationDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'payment.use-case.query-compensation' })
export class PaymentQueryCompensationUseCase extends UseCase {
    constructor(
        @Injection.Inject('payment.repository') private repository: PaymentRepository,
        @Injection.Inject('financial-transaction.repository') private repositoryFinancialTransaction: FinancialTransactionRepository,
    ) {
        super()
    }

    async perform(args: PaymentQueryCompensationDTOArgs) {
        const { financialTransactionId } = this.validateDTO(args, schemaDTO)

        const { value, payments } = await this.getFinancialTransactionWhitPayments(financialTransactionId)

        const stateTotal = {
            value: 0,
            discount: 0,
            increase: 0
        }

        payments.map(({ value, increase, discount }) => {
            stateTotal.value += value
            stateTotal.increase += increase
            stateTotal.discount += discount
        })

        const valueTotalPaid = stateTotal.value + stateTotal.increase - stateTotal.discount
        const valueToPay = value - stateTotal.value - stateTotal.discount

        return Result.success({
            valueFinancialTransaction: value,
            payments: payments,
            valueTotalPaid,
            valueToPay,
            financialTransactionId,
            totalPayments: {
                ...stateTotal
            }
        })
    }

    private async getFinancialTransactionWhitPayments(financialTransactionId: ID) {
        const financialTransactionWithPaymentsResult = await this.repositoryFinancialTransaction.findByIdWithPayments(financialTransactionId)

        if (financialTransactionWithPaymentsResult.isSuccess()) {
            return financialTransactionWithPaymentsResult.getValue()
        }

        throw new BadRequestException({
            ...financialTransactionWithPaymentsResult.getError(),
            title: 'Find Financial Transaction',
            message: `Unable to find financial transaction. Error: "${financialTransactionWithPaymentsResult.getError().message}". Please, try again later`,
        })
    }
}
