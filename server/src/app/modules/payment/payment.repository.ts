import { Service } from '@esliph/module'
import { ID } from '@@types'
import { Repository } from '@services/repository.service'
import { PaymentModel } from '@modules/payment/payment.model'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'
import { Prisma } from '@prisma/client'

type PaymentGetPayloadTypes = boolean | null | undefined | { select?: Prisma.PaymentSelect | null }
type PaymentGetPayload<T extends boolean | null | undefined | { select?: Prisma.PaymentSelect | null }> = Prisma.PaymentGetPayload<T>
type PaymentPropSelect<ArgsSelect extends PaymentGetPayloadTypes> = PaymentGetPayload<ArgsSelect>
type PaymentFindResponse<ArgsSelect extends PaymentGetPayloadTypes> = PaymentPropSelect<ArgsSelect>

@Service({ name: 'payment.repository' })
export class PaymentRepository extends Repository {
    private static GLOBAL_MESSAGE = {
        create: {
            title: 'Register Payment',
            success: 'Payment successfully registered',
            failed: 'Failed to register payment'
        },
        remove: {
            title: 'Remove Payment',
            success: 'Payment successfully removed',
            failed: 'Failed to remove payment'
        },
        removeMany: {
            title: 'Remove Payments',
            success: 'Payment successfully removed',
            failed: 'Failed to remove payments'
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

    async create(args: { data: Prisma.PaymentCreateInput }) {
        try {
            await this.database.instance.payment.create({ ...args })

            return this.handleResponse<{ message: string }>({ message: PaymentRepository.GLOBAL_MESSAGE.create.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: PaymentRepository.GLOBAL_MESSAGE.create.title, message: PaymentRepository.GLOBAL_MESSAGE.create.failed }
            })
        }
    }

    async update(args: { where: Prisma.PaymentWhereUniqueInput, data: Prisma.PaymentUpdateInput }) {
        try {
            await this.database.instance.payment.update({ ...args })

            return this.handleResponse<{ message: string }>({ message: PaymentRepository.GLOBAL_MESSAGE.update.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: PaymentRepository.GLOBAL_MESSAGE.update.title, message: PaymentRepository.GLOBAL_MESSAGE.update.failed }
            })
        }
    }

    async delete(args: { where: Prisma.PaymentWhereUniqueInput }) {
        try {
            await this.database.instance.payment.delete({ ...args })

            return this.handleResponse<{ message: string }>({ message: PaymentRepository.GLOBAL_MESSAGE.remove.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: PaymentRepository.GLOBAL_MESSAGE.remove.title, message: PaymentRepository.GLOBAL_MESSAGE.remove.failed }
            })
        }
    }

    async deleteMany(args: { where: Prisma.PaymentWhereInput }) {
        try {
            await this.database.instance.payment.deleteMany({ ...args })

            return this.handleResponse<{ message: string }>({ message: PaymentRepository.GLOBAL_MESSAGE.remove.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: PaymentRepository.GLOBAL_MESSAGE.remove.title, message: PaymentRepository.GLOBAL_MESSAGE.remove.failed }
            })
        }
    }

    async findFirst<Args extends Prisma.PaymentFindFirstArgs>(args: Args) {
        try {
            const payment = await this.database.instance.payment.findFirst(args) as PaymentFindResponse<Args>

            return this.handleResponse<PaymentFindResponse<Args>>(payment, {
                noAcceptNullable: true,
                error: { title: PaymentRepository.GLOBAL_MESSAGE.find.title, message: PaymentRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<PaymentFindResponse<Args>>(err, {
                error: { title: PaymentRepository.GLOBAL_MESSAGE.find.title, message: PaymentRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findUnique<Args extends Prisma.PaymentFindUniqueArgs>(args: Args) {
        try {
            const payment = await this.database.instance.payment.findUnique(args) as PaymentFindResponse<Args>

            return this.handleResponse<PaymentFindResponse<Args>>(payment, {
                noAcceptNullable: true,
                error: { title: PaymentRepository.GLOBAL_MESSAGE.find.title, message: PaymentRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<PaymentFindResponse<Args>>(err, {
                error: { title: PaymentRepository.GLOBAL_MESSAGE.find.title, message: PaymentRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findMany<Args extends Prisma.PaymentFindManyArgs>(args: Args) {
        try {
            const payment = await this.database.instance.payment.findMany(args) as PaymentFindResponse<Args>[]

            return this.handleResponse<PaymentFindResponse<Args>[]>(payment, {
                noAcceptNullable: true,
                error: { title: PaymentRepository.GLOBAL_MESSAGE.find.title, message: PaymentRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<PaymentFindResponse<Args>[]>(err, {
                error: { title: PaymentRepository.GLOBAL_MESSAGE.find.title, message: PaymentRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }
}
