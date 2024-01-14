import { Service } from '@esliph/module'
import { ID } from '@@types'
import { Prisma } from '@services/database.service'
import { Repository } from '@services/repository.service'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'

type FinancialTransactionGetPayloadTypes = boolean | null | undefined | { select?: Prisma.FinancialTransactionSelect | null }
type FinancialTransactionGetPayload<T extends boolean | null | undefined | { select?: Prisma.FinancialTransactionSelect | null }> = Prisma.FinancialTransactionGetPayload<T>
type FinancialTransactionPropSelect<ArgsSelect extends FinancialTransactionGetPayloadTypes> = FinancialTransactionGetPayload<ArgsSelect>
type FinancialTransactionFindResponse<ArgsSelect extends FinancialTransactionGetPayloadTypes> = FinancialTransactionPropSelect<ArgsSelect>

@Service({ name: 'financial-transaction.repository' })
export class FinancialTransactionRepository extends Repository {
    private static GLOBAL_MESSAGE = {
        create: {
            title: 'Register Financial Transaction',
            success: 'Financial transaction successfully registered',
            failed: 'Failed to register financial transaction'
        },
        remove: {
            title: 'Remove Financial Transaction',
            success: 'Financial transaction successfully removed',
            failed: 'Failed to remove blank'
        },
        update: {
            title: 'Update Financial Transaction',
            success: 'Financial transaction successfully updated',
            failed: 'Failed to update financial transaction data'
        },
        updateMany: {
            title: 'Update Financial Transactions',
            success: 'Financial transactions successfully updated',
            failed: 'Failed to update financial transactions data'
        },
        find: {
            title: 'Find Financial Transaction',
            notFound: 'Financial transaction not found',
            failed: 'Unable to query financial transaction'
        },
        findMany: {
            title: 'Find Financial Transactions',
            failed: 'Unable to query financial transactions'
        }
    }

    async create(args: { data: Prisma.FinancialTransactionCreateInput }) {
        try {
            await this.database.instance.financialTransaction.create({ ...args })

            return this.handleResponse<{ message: string }>({ message: FinancialTransactionRepository.GLOBAL_MESSAGE.create.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.create.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.create.failed }
            })
        }
    }

    async update(args: { where: Prisma.FinancialTransactionWhereUniqueInput, data: Prisma.FinancialTransactionUpdateInput }) {
        try {
            await this.database.instance.financialTransaction.update({ ...args })

            return this.handleResponse<{ message: string }>({ message: FinancialTransactionRepository.GLOBAL_MESSAGE.update.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.update.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.update.failed }
            })
        }
    }

    async updateMany(args: { where: Prisma.FinancialTransactionWhereInput, data: Prisma.FinancialTransactionUpdateInput }) {
        try {
            await this.database.instance.financialTransaction.updateMany({ ...args })

            return this.handleResponse<{ message: string }>({ message: FinancialTransactionRepository.GLOBAL_MESSAGE.update.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.update.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.update.failed }
            })
        }
    }

    async delete(args: { where: Prisma.FinancialTransactionWhereUniqueInput }) {
        try {
            await this.database.instance.financialTransaction.delete({ ...args })

            return this.handleResponse<{ message: string }>({ message: FinancialTransactionRepository.GLOBAL_MESSAGE.remove.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.remove.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.remove.failed }
            })
        }
    }

    async findFirst<Args extends Prisma.FinancialTransactionFindFirstArgs>(args: Args) {
        try {
            const financialTransaction = await this.database.instance.financialTransaction.findFirst(args) as FinancialTransactionFindResponse<Args>

            return this.handleResponse<FinancialTransactionFindResponse<Args>>(financialTransaction, {
                noAcceptNullable: true,
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.find.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<FinancialTransactionFindResponse<Args>>(err, {
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.find.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findUnique<Args extends Prisma.FinancialTransactionFindUniqueArgs>(args: Args) {
        try {
            const financialTransaction = await this.database.instance.financialTransaction.findUnique(args) as FinancialTransactionFindResponse<Args>

            return this.handleResponse<FinancialTransactionFindResponse<Args>>(financialTransaction, {
                noAcceptNullable: true,
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.find.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<FinancialTransactionFindResponse<Args>>(err, {
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.find.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findMany<Args extends Prisma.FinancialTransactionFindManyArgs>(args: Args) {
        try {
            const financialTransaction = await this.database.instance.financialTransaction.findMany(args) as FinancialTransactionFindResponse<Args>[]

            return this.handleResponse<FinancialTransactionFindResponse<Args>[]>(financialTransaction, {
                noAcceptNullable: true,
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.find.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<FinancialTransactionFindResponse<Args>[]>(err, {
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.find.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async updateByIdWithCategory(args: FinancialTransactionModel.UpdateArgs, { create: categoriesToCreate = [], delete: categoriesToDelete = [] }: { create?: ID[], delete?: ID[] }, where: { id: ID }) {
        const transaction = this.transaction()

        try {
            await transaction.begin()
            await this.database.instance.financialTransaction.update({
                where: { id: where.id },
                data: args
            })

            if (categoriesToCreate.length) {
                await this.database.instance.financialTransactionCategory.createMany({
                    data: categoriesToCreate.map(categoryId => ({ categoryId, financialTransactionId: where.id })), skipDuplicates: true
                })
            }
            if (categoriesToDelete.length) {
                await this.database.instance.financialTransactionCategory.deleteMany({
                    where: { financialTransactionId: where.id, categoryId: { in: categoriesToDelete } }
                })
            }

            await transaction.commit()
            return this.handleResponse<{ message: string }>({ message: FinancialTransactionRepository.GLOBAL_MESSAGE.update.success })
        } catch (err: any) {
            await transaction.rollback()
            return this.handleError<{ message: string }>(err, {
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.update.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.update.failed },
            })
        }
    }

    async findAllToRepeat() {
        try {
            const financialTransactions = await this.getDatabase().$queryRawUnsafe<FinancialTransactionModel.FinancialTransaction[]>(
                'SELECT * FROM public.financial_transaction WHERE type_occurrence::text = $1 AND count_repeated_occurrences < times_to_repeat',
                FinancialTransactionModel.TypeOccurrence.PROGRAMMATIC,
            )

            return this.handleResponse<FinancialTransactionModel.FinancialTransaction[]>(
                financialTransactions.map(transaction => ({
                    countRepeatedOccurrences: transaction['count_repeated_occurrences'],
                    createdAt: transaction['created_at'],
                    description: transaction['description'],
                    frequency: transaction['frequency'],
                    id: transaction['id'],
                    priority: transaction['priority'],
                    receiver: transaction['receiver'],
                    sender: transaction['sender'],
                    situation: transaction['situation'],
                    timesToRepeat: transaction['times_to_repeat'],
                    title: transaction['title'],
                    type: transaction['type'],
                    typeOccurrence: transaction['type_occurrence'],
                    updatedAt: transaction['updated_at'],
                    value: transaction['value'],
                    bankAccountId: transaction['bank_account_id'],
                    dateTimeCompetence: transaction['date_time_competence'],
                    expiresIn: transaction['expires_in'],
                    isObservable: transaction['is_observable'],
                    isSendNotification: transaction['is_send_notification']
                })))
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction[]>(err, {
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.findMany.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.findMany.failed },
            })
        }
    }
}
