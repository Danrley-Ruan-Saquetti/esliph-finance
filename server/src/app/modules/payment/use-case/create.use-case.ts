import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { UseCase } from '@common/use-case'
import { ID } from '@@types'
import { BadRequestException } from '@common/exceptions'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { PaymentRepository } from '@modules/payment/payment.repository'
import { GLOBAL_PAYMENT_DTO } from '@modules/payment/payment.global'
import { PaymentModel } from '@modules/payment/payment.model'
import { CompensationPaymentsControl } from '@modules/payment/control/compensation-payments.control'
import { BankAccountUpdateBalanceUseCase } from '@modules/bank-account/use-case/update-balance.use-case'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'

const schemaDTO = ValidatorService.schema.object({
    financialTransactionId: GLOBAL_PAYMENT_DTO.financialTransaction.id,
    value: ValidatorService.schema.coerce
        .number({
            'required_error': GLOBAL_PAYMENT_DTO.value.messageRequire,
            'invalid_type_error': GLOBAL_PAYMENT_DTO.value.messageMustBePositive,
        })
        .nonnegative({ message: GLOBAL_PAYMENT_DTO.value.messageMustBePositive }),
    discount: ValidatorService.schema.coerce
        .number()
        .nonnegative({ message: GLOBAL_PAYMENT_DTO.discount.messageMustBePositive })
        .default(GLOBAL_PAYMENT_DTO.discount.default),
    increase: ValidatorService.schema.coerce
        .number()
        .nonnegative({ message: GLOBAL_PAYMENT_DTO.increase.messageMustBePositive })
        .default(GLOBAL_PAYMENT_DTO.increase.default),
    paidAt: ValidatorService.schema.coerce.date().default(GLOBAL_PAYMENT_DTO.paidAt.default()),
})
    .refine(({ discount, increase, value }) => discount > 0 || increase > 0 || value > 0, { message: GLOBAL_PAYMENT_DTO.super.messageNoValue })

export type PaymentCreateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'payment.use-case.create' })
export class PaymentCreateUseCase extends UseCase {
    constructor(
        @Injection.Inject('payment.repository') private paymentRepository: PaymentRepository,
        @Injection.Inject('financial-transaction.repository') private financialTransactionRepository: FinancialTransactionRepository,
        @Injection.Inject('bank-account.use-case.update-balance') private updateBalanceUC: BankAccountUpdateBalanceUseCase,
    ) {
        super()
    }

    async perform(args: PaymentCreateDTOArgs) {
        const transaction = this.database.transaction()

        try {
            await transaction.begin()
            const result = await this.performUC(args)
            await transaction.commit()

            return result
        } catch (err: any) {
            await transaction.rollback()

            throw err
        }
    }

    async performUC(args: PaymentCreateDTOArgs) {
        const dateCurrent = new Date(Date.now())
        const { discount, financialTransactionId, paidAt, increase, value } = this.validateDTO(args, schemaDTO)

        this.validPaidAt(dateCurrent, paidAt)
        const { paidInFull, netValuePayment } = await this.validCompensation(financialTransactionId, { discount, increase, value })
        await this.registerPayment({ discount, financialTransactionId, paidAt, increase, value })
        await this.updateBalanceBankAccount({ financialTransactionId, value: netValuePayment })

        return Result.success({ message: 'Payment registered successfully', paidInFull })
    }

    private validPaidAt(current: Date, paidAt: Date) {
        if (current >= paidAt) {
            return
        }

        throw new BadRequestException({
            title: 'Register Payment',
            message: GLOBAL_PAYMENT_DTO.paidAt.messagePaidAtHigherCurrentDate,
        })
    }

    private async validCompensation(financialTransactionId: ID, paymentData: { value: number; discount: number; increase: number }) {
        const compensationControl = Injection.resolve(CompensationPaymentsControl)
        await compensationControl.loadComponents(financialTransactionId)

        const validResult = compensationControl.validCompensation(paymentData)

        const netValuePayment = paymentData.value - paymentData.increase

        if (validResult.isSuccess()) {
            return { ...validResult.getValue(), netValuePayment }
        }

        throw new BadRequestException({ ...validResult.getError(), })
    }

    private async registerPayment(data: PaymentModel.Model) {
        const paymentResult = await this.paymentRepository.register(data)

        if (paymentResult.isSuccess()) {
            return
        }

        throw new BadRequestException({
            ...paymentResult.getError(),
            title: 'Register Payment',
        })
    }

    private async updateBalanceBankAccount({ financialTransactionId, value }: { value: number, financialTransactionId: ID }) {
        const { type, bankAccountId } = await this.queryFinancialTransaction(financialTransactionId)

        if (type == FinancialTransactionModel.Type.INCOME) {
            await this.updateBalanceUC.receiver({ id: bankAccountId, value })
        } else if (type == FinancialTransactionModel.Type.EXPENSE) {
            await this.updateBalanceUC.liquidate({ id: bankAccountId, value })
        }
    }

    private async queryFinancialTransaction(id: ID) {
        const financialTransactionResult = await this.financialTransactionRepository.findById(id)

        if (!financialTransactionResult.isSuccess()) {
            throw new BadRequestException({
                ...financialTransactionResult.getError(),
                title: 'Find Financial Transaction'
            })
        }

        return financialTransactionResult.getValue()
    }
}
