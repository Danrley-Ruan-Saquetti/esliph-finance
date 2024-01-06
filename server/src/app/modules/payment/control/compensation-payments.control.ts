import { BadRequestException } from '@common/exceptions'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { ID } from '@@types'
import { PaymentModel } from '@modules/payment/payment.model'
import { PaymentRepository } from '@modules/payment/payment.repository'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { GLOBAL_FINANCIAL_TRANSACTION_RULES } from '@modules/financial-transaction/financial-transaction.global'
import { Result } from '@esliph/common'

@Service({ name: 'compensation-payments.control' })
export class CompensationPaymentsControl {
    private financialTransactionId: ID
    private financialTransaction: {
        situation: FinancialTransactionModel.Situation
        value: number
    }
    private payments: (PaymentModel.Model & { id: ID })[] = []
    private state: {
        valueFinancialTransaction: number,
        totalNetValuePaid: number
        valueToPay: number
        totalPayments: {
            value: number
            discount: number
            increase: number
        }
    }

    constructor(
        @Injection.Inject('financial-transaction.repository') private repositoryFinancialTransaction: FinancialTransactionRepository,
        @Injection.Inject('payment.repository') private repositoryPayment: PaymentRepository,
    ) { }

    async loadComponents(financialTransactionId: ID) {
        this.setFinancialTransactionId(financialTransactionId)
        await this.loadFinancialTransactionAndPayments()
        this.loadState()
    }

    loadState() {
        const stateTotal = this.payments.reduce(
            (acc, payment) => ({
                value: acc.value + payment.value,
                discount: acc.discount + payment.discount,
                increase: acc.increase + payment.increase,
            }),
            {
                value: 0,
                discount: 0,
                increase: 0
            }
        )

        const totalNetValuePaid = stateTotal.value - stateTotal.increase
        const valueToPay = this.financialTransaction.value - (stateTotal.value - stateTotal.increase + stateTotal.discount)

        this.state = {
            valueFinancialTransaction: this.financialTransaction.value,
            totalNetValuePaid,
            valueToPay,
            totalPayments: stateTotal,
        }
    }

    validCompensation({ discount, increase, value }: { value: number, discount: number, increase: number }) {
        if (!GLOBAL_FINANCIAL_TRANSACTION_RULES.paid.situationsEnableToPaid.enum.find(situation => situation == this.financialTransaction.situation)) {
            return Result.failure<{ paidInFull: boolean }>({
                title: 'Valid Compensation',
                message: GLOBAL_FINANCIAL_TRANSACTION_RULES.paid.situationsEnableToPaid.messageNoSituationEnableToPaid
            })
        }

        if (this.state.valueToPay <= 0) {
            return Result.failure<{ paidInFull: boolean }>({
                title: 'Valid Compensation',
                message: 'Financial transaction already paid'
            })
        }

        if (discount > this.state.valueToPay) {
            return Result.failure<{ paidInFull: boolean }>({
                title: 'Valid Compensation',
                message: 'Discount value cannot be higher than then value to pay'
            })
        }

        const netValuePayment = value - increase
        const netValueToPaid = this.state.valueToPay - discount

        if (netValuePayment > netValueToPaid) {
            return Result.failure<{ paidInFull: boolean }>({
                title: 'Valid Compensation',
                message: 'The payment value cannot be higher than the value payable'
            })
        }

        return Result.success<{ paidInFull: boolean }>({ paidInFull: netValueToPaid - netValuePayment == 0 })
    }

    getState() {
        return {
            financialTransactionId: this.financialTransactionId,
            situation: this.financialTransaction.situation,
            ...this.state,
            payments: this.payments,
        }
    }

    async loadFinancialTransactionAndPayments() {
        const financialTransactionResult = await this.repositoryFinancialTransaction.findByIdWithPayments(this.financialTransactionId)

        if (!financialTransactionResult.isSuccess()) {
            throw new BadRequestException({ ...financialTransactionResult.getError() })
        }

        this.financialTransaction = {
            value: financialTransactionResult.getValue().value,
            situation: financialTransactionResult.getValue().situation,
        }
        this.payments = financialTransactionResult.getValue().payments.map(({ id, financialTransactionId, value, discount, increase, paidAt }) => ({ id, financialTransactionId, value, discount, increase, paidAt }))
    }

    async loadFinancialTransaction() {
        const financialTransactionResult = await this.repositoryFinancialTransaction.findById(this.financialTransactionId)

        if (!financialTransactionResult.isSuccess()) {
            throw new BadRequestException({ ...financialTransactionResult.getError() })
        }

        this.financialTransaction = {
            value: financialTransactionResult.getValue().value,
            situation: financialTransactionResult.getValue().situation,
        }
    }

    async loadPayments() {
        const payments = await this.repositoryPayment.findManyByFinancialTransactionId(this.financialTransactionId)

        if (!payments.isSuccess()) {
            throw new BadRequestException({ ...payments.getError() })
        }

        this.payments = payments.getValue().map(({ id, financialTransactionId, value, discount, increase, paidAt }) => ({ id, financialTransactionId, value, discount, increase, paidAt }))
    }

    setFinancialTransaction(financialTransaction: { situation: FinancialTransactionModel.Situation, value: number }) {
        this.financialTransaction = financialTransaction
    }

    setPayments(payments: (PaymentModel.Model & { id: ID })[]) {
        this.payments = payments
    }

    setFinancialTransactionId(financialTransactionId: ID) {
        this.financialTransactionId = financialTransactionId
    }
}