import { Service } from '@esliph/module'
import { ID } from '@@types'
import { Repository } from '@services/repository.service'
import { PaymentModel } from '@modules/payment/payment.model'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'

@Service({ name: 'payment.repository' })
export class PaymentRepository extends Repository {
    private static GLOBAL_MESSAGE = {
        create: {
            title: 'Register Payment',
            success: 'Payment successfully registered',
            failed: 'Failed to register payment'
        },
        update: {
            title: 'Update Payment',
            success: 'Payment successfully updated',
            failed: 'Failed to update payment data'
        },
        find: {
            title: 'Find Payment',
            notFound: 'Payment not found',
            failed: 'Unable to query payment'
        },
        findMany: {
            title: 'Find Payments',
            failed: 'Unable to query payments'
        }
    }

    async register({ discount, financialTransactionId, increase, paidAt, value }: PaymentModel.Model) {
        try {
            await this.database.instance.payment.create({ data: { discount, financialTransactionId, increase, paidAt, value } })

            return this.handleResponse<{ message: string }>({ message: PaymentRepository.GLOBAL_MESSAGE.create.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: PaymentRepository.GLOBAL_MESSAGE.create.title, message: PaymentRepository.GLOBAL_MESSAGE.create.failed }
            })
        }
    }

    async updateById(args: PaymentModel.Model, where: { id: number }) {
        try {
            await this.database.instance.payment.update({ where: { id: where.id }, data: args })

            return this.handleResponse<{ message: string }>({ message: PaymentRepository.GLOBAL_MESSAGE.update.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: PaymentRepository.GLOBAL_MESSAGE.update.title, message: PaymentRepository.GLOBAL_MESSAGE.update.failed }
            })
        }
    }

    async findById(id: ID) {
        try {
            const payment = await this.database.instance.payment.findFirst({ where: { id } })

            return this.handleResponse<PaymentModel.Payment>(payment, {
                noAcceptNullable: true,
                error: { title: PaymentRepository.GLOBAL_MESSAGE.find.title, message: PaymentRepository.GLOBAL_MESSAGE.find.notFound }
            })
        } catch (err: any) {
            return this.handleError<PaymentModel.Payment>(err, {
                error: { title: PaymentRepository.GLOBAL_MESSAGE.find.title, message: PaymentRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findByIdAndBankAccountId(id: ID, bankAccountId: ID) {
        try {
            const payment = await this.database.instance.payment.findFirst({ where: { id, financialTransaction: { bankAccountId } } })

            return this.handleResponse<PaymentModel.Payment>(payment, {
                noAcceptNullable: true,
                error: { title: PaymentRepository.GLOBAL_MESSAGE.find.title, message: PaymentRepository.GLOBAL_MESSAGE.find.notFound }
            })
        } catch (err: any) {
            return this.handleError<PaymentModel.Payment>(err, {
                error: { title: PaymentRepository.GLOBAL_MESSAGE.find.title, message: PaymentRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findByIdAndBankAccountIdAndFinancialTransactionId(id: ID, bankAccountId: ID, financialTransactionId: ID) {
        try {
            const payment = await this.database.instance.payment.findFirst({ where: { id, financialTransactionId, financialTransaction: { bankAccountId } } })

            return this.handleResponse<PaymentModel.Payment>(payment, {
                noAcceptNullable: true,
                error: { title: PaymentRepository.GLOBAL_MESSAGE.find.title, message: PaymentRepository.GLOBAL_MESSAGE.find.notFound }
            })
        } catch (err: any) {
            return this.handleError<PaymentModel.Payment>(err, {
                error: { title: PaymentRepository.GLOBAL_MESSAGE.find.title, message: PaymentRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findManyByBankAccountIdAndFinancialTransactionId(bankAccountId: ID, financialTransactionId: ID) {
        try {
            const payments = await this.database.instance.payment.findMany({ where: { financialTransactionId, financialTransaction: { bankAccountId } } })

            return this.handleResponse<PaymentModel.Payment[]>(payments)
        } catch (err: any) {
            return this.handleError<PaymentModel.Payment[]>(err, {
                error: { title: PaymentRepository.GLOBAL_MESSAGE.findMany.title, message: PaymentRepository.GLOBAL_MESSAGE.findMany.failed }
            })
        }
    }

    async findManyByBankAccountId(bankAccountId: ID) {
        try {
            const payments = await this.database.instance.payment.findMany({ where: { financialTransaction: { bankAccountId } } })

            return this.handleResponse<PaymentModel.Payment[]>(payments)
        } catch (err: any) {
            return this.handleError<PaymentModel.Payment[]>(err, {
                error: { title: PaymentRepository.GLOBAL_MESSAGE.findMany.title, message: PaymentRepository.GLOBAL_MESSAGE.findMany.failed }
            })
        }
    }

    async findManyByFinancialTransactionId(financialTransactionId: ID) {
        try {
            const payments = await this.database.instance.payment.findMany({ where: { financialTransactionId } })

            return this.handleResponse<PaymentModel.Payment[]>(payments)
        } catch (err: any) {
            return this.handleError<PaymentModel.Payment[]>(err, {
                error: { title: PaymentRepository.GLOBAL_MESSAGE.findMany.title, message: PaymentRepository.GLOBAL_MESSAGE.findMany.failed }
            })
        }
    }

    async findManyByBankAccountIdAndTypesFinancialTransaction(bankAccountId: ID, types: FinancialTransactionModel.Type[]) {
        try {
            const payments = await this.database.instance.payment.findMany({ where: { financialTransaction: { bankAccountId, type: { in: types } } } })

            return this.handleResponse<PaymentModel.Payment[]>(payments)
        } catch (err: any) {
            return this.handleError<PaymentModel.Payment[]>(err, {
                error: { title: PaymentRepository.GLOBAL_MESSAGE.findMany.title, message: PaymentRepository.GLOBAL_MESSAGE.findMany.failed }
            })
        }
    }
}
