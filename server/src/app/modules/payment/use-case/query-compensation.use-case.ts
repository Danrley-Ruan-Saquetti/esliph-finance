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

        const valueAmountPaid = payments.map(payment => payment.value - payment.discount + payment.increase).reduce((acc, value) => acc + value, 0)

        const pendingPaymentAmount = value - valueAmountPaid

        return Result.success({
            valueFinancialTransaction: value,
            payments: payments,
            valueAmountPaid,
            pendingPaymentAmount
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
