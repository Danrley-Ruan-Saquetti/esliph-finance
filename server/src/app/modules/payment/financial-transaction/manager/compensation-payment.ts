import { BadRequestException } from '@exceptions/bad-request'
import { MonetaryValue } from '@services/monetary-value'

type FinancialTransaction = {
    value: number
}

type Payment = {
    valuePaid: number
    discount: number
    increase: number
}

type TotalPayments = Payment

type PaymentStatement = {
    valueFinancialTransaction: number
    totalNetValuePaid: number
    valueToPay: number
    totalPayments: TotalPayments
}

export class CompensationPaymentManager {
    private financialTransaction: FinancialTransaction
    private payments: Payment[]
    private paymentStatement: PaymentStatement = null as any
    private totalPayments: TotalPayments = null as any

    constructor(
        { value = 0 }: Partial<FinancialTransaction> = {},
        payments: Partial<Payment>[] = []
    ) {
        this.payments = payments.map(({ discount = 0, increase = 0, valuePaid = 0 }) => ({ discount, increase, valuePaid }))
        this.financialTransaction = { value }
    }

    checkValidatePayment(args: Partial<Payment> = {}) {
        const isValidPayment = this.validatePayment(args)

        if (!isValidPayment.ok)
            throw new BadRequestException({ title: 'Valid Payment', message: isValidPayment.message })
    }

    validatePayment({ valuePaid = 0, discount = 0, increase = 0 }: Partial<Payment> = {}) {
        const paymentStatement = this.getPaymentStatement()

        if (paymentStatement.valueToPay <= 0)
            return { ok: false, message: 'Financial transaction already paid', isComplete: false }

        if (discount > paymentStatement.valueToPay)
            return { ok: false, message: 'Discount value cannot be higher than then value to pay', isComplete: false }

        const netValuePayment = valuePaid - increase
        const netValueToPaid = paymentStatement.valueToPay - discount

        if (netValuePayment > netValueToPaid)
            return { ok: false, message: 'The payment value cannot be higher than the value to pay', isComplete: false }

        return { ok: true, message: 'Validated payment', isComplete: netValuePayment == netValueToPaid }
    }

    getPaymentStatement() {
        if (this.paymentStatement) return this.paymentStatement

        this.paymentStatement = this.calculatePaymentStatement()

        return this.paymentStatement
    }

    calculatePaymentStatement() {
        const totalPayments = this.getTotalPayments()

        return {
            valueFinancialTransaction: this.financialTransaction.value,
            totalNetValuePaid: totalPayments.valuePaid - totalPayments.increase,
            valueToPay: this.financialTransaction.value - (totalPayments.valuePaid - totalPayments.increase + totalPayments.discount),
            totalPayments,
        } as PaymentStatement
    }

    getPaymentStatementInReal(): PaymentStatement {
        const paymentStatement = this.getPaymentStatement()

        return {
            valueFinancialTransaction: MonetaryValue.toReal(paymentStatement.valueFinancialTransaction),
            totalNetValuePaid: MonetaryValue.toReal(paymentStatement.totalNetValuePaid),
            valueToPay: MonetaryValue.toReal(paymentStatement.valueToPay),
            totalPayments: {
                valuePaid: MonetaryValue.toReal(paymentStatement.totalPayments.valuePaid),
                discount: MonetaryValue.toReal(paymentStatement.totalPayments.discount),
                increase: MonetaryValue.toReal(paymentStatement.totalPayments.increase),
            }
        }
    }

    getTotalPayments() {
        if (this.totalPayments) return this.totalPayments

        this.totalPayments = this.payments.reduce((acc, payment) => ({
            valuePaid: acc.valuePaid + payment.valuePaid,
            discount: acc.discount + payment.discount,
            increase: acc.increase + payment.increase,
        }), { valuePaid: 0, discount: 0, increase: 0, })

        return this.totalPayments
    }

    setFinancialTransaction(financialTransaction: FinancialTransaction) {
        this.financialTransaction = financialTransaction
        this.paymentStatement = null as any
    }

    setPayments(payments: Payment[]) {
        this.payments = payments
        this.paymentStatement = null as any
        this.totalPayments = null as any
    }

    getFinancialTransaction() {
        return this.financialTransaction
    }

    getPayments() {
        return this.payments
    }
}