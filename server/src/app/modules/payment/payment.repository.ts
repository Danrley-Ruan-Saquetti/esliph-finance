import { Service } from '@esliph/module'
import { ID } from '@@types'
import { Repository } from '@services/repository.service'
import { PaymentModel } from '@modules/payment/payment.model'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'

@Service({ name: 'payment.repository' })
export class PaymentRepository extends Repository {
    async register({ discount, financialTransactionId, increase, paidAt, value }: PaymentModel.Model) {
        try {
            await this.database.instance.payment.create({ data: { discount, financialTransactionId, increase, paidAt, value } })

            return this.handleResponse<{ message: string }>(
                { message: 'Payment successfully registered' },
                { error: { title: 'Register Payment', message: 'Payment successfully registered' } },
            )
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, { error: { title: 'Register Payment', message: 'Unable to register payment' } })
        }
    }

    async updateById(args: PaymentModel.Model, where: { id: number }) {
        try {
            await this.database.instance.payment.update({ where: { id: where.id }, data: args })

            return this.handleResponse<{ message: string }>(
                { message: 'Payment successfully updated' },
                { error: { title: 'Update Payment', message: 'Payment successfully updated' } },
            )
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, { error: { title: 'Update Payment', message: 'Unable to update payment' } })
        }
    }

    async findById(id: ID) {
        try {
            const payment = await this.database.instance.payment.findFirst({ where: { id } })

            return this.handleResponse<PaymentModel.Payment>(payment, {
                noAcceptNullable: true,
                error: { title: 'Find Payment', message: 'Payment not found' },
            })
        } catch (err: any) {
            return this.handleError<PaymentModel.Payment>(err, { error: { title: 'Find Payment', message: 'Payment not found' } })
        }
    }

    async findByIdAndBankAccountId(id: ID, bankAccountId: ID) {
        try {
            const payment = await this.database.instance.payment.findFirst({ where: { id, financialTransaction: { bankAccountId } } })

            return this.handleResponse<PaymentModel.Payment>(payment, {
                noAcceptNullable: true,
                error: { title: 'Find Payment', message: 'Payment not found' },
            })
        } catch (err: any) {
            return this.handleError<PaymentModel.Payment>(err, {
                error: { title: 'Find Payment', message: 'Payment not found' },
            })
        }
    }

    async findByIdAndBankAccountIdAndFinancialTransactionId(id: ID, bankAccountId: ID, financialTransactionId: ID) {
        try {
            const payment = await this.database.instance.payment.findFirst({ where: { id, financialTransactionId, financialTransaction: { bankAccountId } } })

            return this.handleResponse<PaymentModel.Payment>(payment, {
                noAcceptNullable: true,
                error: { title: 'Find Payment', message: 'Payment not found' },
            })
        } catch (err: any) {
            return this.handleError<PaymentModel.Payment>(err, { error: { title: 'Find Payment', message: 'Payment not found' } })
        }
    }

    async findManyByBankAccountIdAndFinancialTransactionId(bankAccountId: ID, financialTransactionId: ID) {
        try {
            const payments = await this.database.instance.payment.findMany({ where: { financialTransactionId, financialTransaction: { bankAccountId } } })

            return this.handleResponse<PaymentModel.Payment[]>(payments, {
                error: { title: 'Find Payments', message: 'Payments not found' },
            })
        } catch (err: any) {
            return this.handleError<PaymentModel.Payment[]>(err, { error: { title: 'Find Payments', message: 'Payments not found' } })
        }
    }

    async findManyByBankAccountId(bankAccountId: ID) {
        try {
            const payments = await this.database.instance.payment.findMany({ where: { financialTransaction: { bankAccountId } } })

            return this.handleResponse<PaymentModel.Payment[]>(payments, {
                error: { title: 'Find Payments', message: 'Payments not found' },
            })
        } catch (err: any) {
            return this.handleError<PaymentModel.Payment[]>(err, { error: { title: 'Find Payments', message: 'Payments not found' } })
        }
    }

    async findManyByFinancialTransactionId(financialTransactionId: ID) {
        try {
            const payments = await this.database.instance.payment.findMany({ where: { financialTransactionId } })

            return this.handleResponse<PaymentModel.Payment[]>(payments, {
                error: { title: 'Find Payments', message: 'Payments not found' },
            })
        } catch (err: any) {
            return this.handleError<PaymentModel.Payment[]>(err, { error: { title: 'Find Payments', message: 'Payments not found' } })
        }
    }

    async findManyByBankAccountIdAndTypesFinancialTransaction(bankAccountId: ID, types: FinancialTransactionModel.Type[]) {
        try {
            const payments = await this.database.instance.payment.findMany({ where: { financialTransaction: { bankAccountId, type: { in: types } } } })

            return this.handleResponse<PaymentModel.Payment[]>(payments, {
                noAcceptNullable: true,
                error: { title: 'FindPayments', message: 'Payments not found' },
            })
        } catch (err: any) {
            return this.handleError<PaymentModel.Payment[]>(err, { error: { title: 'Find Payments', message: 'Payments not found' } })
        }
    }
}
