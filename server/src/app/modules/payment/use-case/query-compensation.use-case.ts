import { Result, Injection, Service } from '@core'
import { UseCase } from '@common/use-case'
import { SchemaValidator } from '@services/validator.service'
import { GLOBAL_PAYMENT_DTO } from '@modules/payment/payment.global'
import { CompensationPaymentsControl } from '@modules/payment/control/compensation-payments.control'

const schemaDTO = SchemaValidator.object({
    financialTransactionId: GLOBAL_PAYMENT_DTO.financialTransaction.id
})

export type PaymentQueryCompensationDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'payment.use-case.query-compensation' })
export class PaymentQueryCompensationUseCase extends UseCase {
    constructor(
        @Injection.Inject('compensation-payments.control') private compensationControl: CompensationPaymentsControl,
    ) {
        super()
    }

    async perform(args: PaymentQueryCompensationDTOArgs) {
        const { financialTransactionId } = this.validateDTO(args, schemaDTO)

        await this.compensationControl.loadComponents(financialTransactionId)

        return Result.success(this.compensationControl.getState())
    }
}
