import { Service } from '@esliph/module'
import { ID } from '@@types'
import { Prisma } from '@services/database.service'
import { Repository, RepositoryPagination } from '@services/repository.service'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'
import { CategoryModel } from '../category/category.model'

@Service({ name: 'financial-transaction.repository' })
export class FinancialTransactionRepository extends Repository {
    private static GLOBAL_MESSAGE = {
        create: {
            title: 'Register Financial Transaction',
            success: 'Financial transaction successfully registered',
            failed: 'Failed to register financial transaction'
        },
        update: {
            title: 'Update Financial Transaction',
            success: 'Financial transaction successfully updated',
            failed: 'Failed to update financial transaction data'
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

    async register({ data, notes = [], categories = [] }: { data: FinancialTransactionModel.Model, notes?: { description: string }[], categories?: { id: number }[] }) {
        try {
            await this.database.instance.financialTransaction.create({
                data: {
                    ...data,
                    notes: { createMany: { data: notes } },
                    categories: { createMany: { data: categories.map(({ id }) => ({ categoryId: id })) } }
                },
            })

            return this.handleResponse<{ message: string }>({ message: FinancialTransactionRepository.GLOBAL_MESSAGE.create.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.create.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.create.failed },
            })
        }
    }

    async updateById(args: FinancialTransactionModel.UpdateArgs, where: { id: ID }) {
        try {
            await this.database.instance.financialTransaction.update({
                where: { id: where.id },
                data: { ...args, categories: {} }
            })

            return this.handleResponse<{ message: string }>({ message: FinancialTransactionRepository.GLOBAL_MESSAGE.update.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.update.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.update.failed },
            })
        }
    }

    async updateByIdWithCategory(args: FinancialTransactionModel.UpdateArgs, { create: categoriesToCreate = [], delete: categoriesToDelete = [] }: { create?: ID[], delete?: ID[] }, where: { id: ID }) {
        try {
            await this.database.instance.financialTransaction.update({
                where: { id: where.id },
                data: {
                    ...args,
                    categories: {
                        deleteMany: {
                            financialTransactionId: where.id,
                            categoryId: {
                                in: categoriesToDelete
                            }
                        },
                        createMany: {
                            data: categoriesToCreate.map(categoryId => ({ categoryId })),
                            skipDuplicates: true
                        }
                    }
                }
            })

            return this.handleResponse<{ message: string }>({ message: FinancialTransactionRepository.GLOBAL_MESSAGE.update.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.update.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.update.failed },
            })
        }
    }

    async findById(id: ID) {
        try {
            const financialTransaction = await this.database.instance.financialTransaction.findFirst({ where: { id } })

            return this.handleResponse<FinancialTransactionModel.FinancialTransaction>(financialTransaction, {
                noAcceptNullable: true,
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.find.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction>(err, {
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.find.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.find.failed },
            })
        }
    }

    async findByIdAndBankAccountId(id: ID, bankAccountId: ID) {
        try {
            const financialTransaction = await this.database.instance.financialTransaction.findFirst({ where: { id, bankAccountId } })

            return this.handleResponse<FinancialTransactionModel.FinancialTransaction>(financialTransaction, {
                noAcceptNullable: true,
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.find.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction>(err, {
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.find.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.find.failed },
            })
        }
    }

    async findByIdWithPayments(id: ID) {
        try {
            const financialTransaction = await this.database.instance.financialTransaction.findFirst({
                where: { id },
                include: { payments: { orderBy: { paidAt: 'desc' } } },
            })

            return this.handleResponse<FinancialTransactionModel.FinancialTransactionWithPayments>(financialTransaction, {
                noAcceptNullable: true,
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.find.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransactionWithPayments>(err, {
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.find.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.find.failed },
            })
        }
    }

    async findByIdWithNotes(id: ID) {
        try {
            const financialTransaction = await this.database.instance.financialTransaction.findFirst({
                where: { id },
                include: { notes: { orderBy: { createdAt: 'desc' } } },
            })

            return this.handleResponse<FinancialTransactionModel.FinancialTransactionWithNotes>(financialTransaction, {
                noAcceptNullable: true,
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.find.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransactionWithNotes>(err, {
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.find.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.find.failed },
            })
        }
    }

    async findByIdWithPaymentsAndNotesAndCategories(id: ID) {
        try {
            const financialTransaction = await this.database.instance.financialTransaction.findFirst({
                where: { id },
                include: {
                    categories: { include: { category: true }, orderBy: { category: { isFavorite: 'asc' } } },
                    payments: { orderBy: { paidAt: 'desc' } },
                    notes: { orderBy: { createdAt: 'desc' } },
                },
                orderBy: {
                    expiresIn: 'asc',
                },
            })

            const categories: CategoryModel.Category[] = financialTransaction?.categories.map(({ category }) => ({ ...category })) || []

            return this.handleResponse<FinancialTransactionModel.FinancialTransactionWithPaymentsAndNotesAndCategories>(
                // @ts-expect-error
                { ...financialTransaction, categories },
                {
                    noAcceptNullable: true,
                    error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.find.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.find.notFound },
                })
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransactionWithPaymentsAndNotesAndCategories>(err, {
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.find.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.find.failed },
            })
        }
    }

    async findManyByBankAccountId(bankAccountId: ID) {
        try {
            const financialTransactions = await this.database.instance.financialTransaction.findMany({
                where: { bankAccountId },
                orderBy: { expiresIn: 'asc' },
            })

            return this.handleResponse<FinancialTransactionModel.FinancialTransaction[]>(financialTransactions)
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction[]>(err, {
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.findMany.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.findMany.failed },
            })
        }
    }

    async findManyByBankAccountIdWithCategories(bankAccountId: ID) {
        try {
            const financialTransactions = await this.database.instance.financialTransaction.findMany({
                where: { bankAccountId },
                include: {
                    categories: {
                        select: { category: true }
                    }
                },
                orderBy: { expiresIn: 'asc' },
            })

            return this.handleResponse<FinancialTransactionModel.FinancialTransactionWithCategories[]>(financialTransactions.map(transaction => ({
                ...transaction,
                categories: transaction.categories.map(({ category }) => category)
            })))
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction[]>(err, {
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.findMany.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.findMany.failed },
            })
        }
    }

    async findManyByBankAccountIdAndSituations(bankAccountId: ID, situations: FinancialTransactionModel.Situation[]) {
        try {
            const financialTransactions = await this.database.instance.financialTransaction.findMany({
                where: { bankAccountId, situation: { in: situations } },
                orderBy: { expiresIn: 'asc' },
            })

            return this.handleResponse<FinancialTransactionModel.FinancialTransaction[]>(financialTransactions)
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction[]>(err, {
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.findMany.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.findMany.failed },
            })
        }
    }

    async findManyByBankAccountIdAndTypes(bankAccountId: ID, types: FinancialTransactionModel.Type[]) {
        try {
            const financialTransactions = await this.database.instance.financialTransaction.findMany({
                where: { bankAccountId, type: { in: types } },
                orderBy: { expiresIn: 'asc' },
            })

            return this.handleResponse<FinancialTransactionModel.FinancialTransaction[]>(financialTransactions)
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction[]>(err, {
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.findMany.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.findMany.failed },
            })
        }
    }

    async findManyByBankAccountIdAndCategoryIdWithCategories(bankAccountId: ID, categoryId: ID) {
        try {
            const financialTransactions = await this.database.instance.financialTransaction.findMany({
                where: { bankAccountId, categories: { some: { categoryId } } },
                orderBy: { expiresIn: 'asc' },
                include: {
                    categories: {
                        select: { category: true }
                    }
                }
            })

            return this.handleResponse<FinancialTransactionModel.FinancialTransactionWithCategories[]>(financialTransactions.map(transaction => ({
                ...transaction,
                categories: transaction.categories.map(({ category }) => category)
            })))
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction[]>(err, {
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.findMany.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.findMany.failed },
            })
        }
    }

    async findManyByBankAccountIdAndTypeOccurrence(bankAccountId: ID, typeOccurrences: FinancialTransactionModel.TypeOccurrence[]) {
        try {
            const financialTransactions = await this.database.instance.financialTransaction.findMany({
                where: { bankAccountId, typeOccurrence: { in: typeOccurrences } },
                orderBy: { expiresIn: 'asc' },
            })

            return this.handleResponse<FinancialTransactionModel.FinancialTransaction[]>(financialTransactions)
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction[]>(err, {
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.findMany.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.findMany.failed },
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
