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
import { PaymentQueryCompensationUseCase } from '@modules/payment/use-case/query-compensation.use-case'

const schemaDTO = ValidatorService.schema.object({
    financialTransactionId: GLOBAL_PAYMENT_DTO.financialTransaction.id,
    value: ValidatorService.schema
        .coerce
        .number({
            'required_error': GLOBAL_PAYMENT_DTO.value.messageRequire,
            'invalid_type_error': GLOBAL_PAYMENT_DTO.value.messageMustBePositive
        }),
    discount: ValidatorService.schema
        .coerce
        .number()
        .default(GLOBAL_PAYMENT_DTO.discount.default),
    increase: ValidatorService.schema
        .coerce
        .number()
        .default(GLOBAL_PAYMENT_DTO.increase.default),
    paidAt: ValidatorService.schema
        .coerce
        .date()
        .default(GLOBAL_PAYMENT_DTO.paidAt.default()),
})

export type PaymentCreateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'payment.use-case.create' })
export class PaymentCreateUseCase extends UseCase {
    constructor(
        @Injection.Inject('payment.repository') private repository: PaymentRepository,
        @Injection.Inject('payment.use-case.query-compensation') private queryCompensationUC: PaymentQueryCompensationUseCase,
    ) {
        super()
    }

    async perform(args: PaymentCreateDTOArgs) {
        const { discount, financialTransactionId, paidAt, increase, value } = this.validateDTO(args, schemaDTO)

        this.validPaidAt(paidAt)
        this.validCompensation(financialTransactionId, { value, discount, increase })

        // await this.registerPayment({ discount, financialTransactionId, paidAt, increase, value })

        return Result.success({ message: 'Payment registered successfully' })
    }

    private async validCompensation(financialTransactionId: ID, { discount, increase, value }: { value: number, discount: number, increase: number }) {
        const compensation = await this.queryCompensation(financialTransactionId)

        console.log(compensation)

        if (compensation.valueToPay <= 0) {
            throw new BadRequestException({
                title: 'Register Payment',
                message: 'Financial transaction already paid'
            })
        }

        const valueOfPayment = value - discount

        if (valueOfPayment > compensation.valueToPay) {
            throw new BadRequestException({
                title: 'Register Payment',
                message: 'The payment value cannot be higher than the amount payable'
            })
        }
    }

    private validPaidAt(paidAt: Date) {
        if (new Date(Date.now()) < new Date(paidAt)) {
            throw new BadRequestException({
                title: 'Register Payment',
                message: 'Payment date cannot be greater than the current date'
            })
        }
    }

    private async queryCompensation(financialTransactionId: ID) {
        const compensationResult = await this.queryCompensationUC.perform({ financialTransactionId })

        if (compensationResult.isSuccess()) {
            return compensationResult.getValue()
        }

        throw new BadRequestException({
            ...compensationResult.getError(),
            title: 'Register Payment',
            message: `Unable query compensation. Error: "${compensationResult.getError().message}". Please, try again later`,
        })
    }

    private async registerPayment(data: SchemaValidator.output<typeof schemaDTO>) {
        const paymentResult = await this.repository.register(data)

        if (paymentResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...paymentResult.getError(),
            title: 'Register Payment',
            message: `Unable to register payment. Error: "${paymentResult.getError().message}". Please, try again later`,
        })
    }
}