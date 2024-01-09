import { Service } from '@esliph/module'
import { ID } from '@@types'
import { Prisma } from '@services/database.service'
import { Repository, RepositoryPagination } from '@services/repository.service'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'

export type FinancialTransactionWhereArgs = Prisma.FinancialTransactionWhereInput
export type FinancialTransactionSelectArgs = keyof FinancialTransactionModel.FinancialTransaction
export type FinancialTransactionQuery = {
    where: FinancialTransactionWhereArgs
    select: { [x in FinancialTransactionSelectArgs]?: boolean }
    page: RepositoryPagination
}

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
            await this.database.instance.financialTransaction.update({ where: { id: where.id }, data: args })

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
                    payments: { orderBy: { paidAt: 'desc' } },
                    notes: { orderBy: { createdAt: 'desc' } },
                },
                orderBy: {
                    expiresIn: 'asc',
                },
            })

            return this.handleResponse<FinancialTransactionModel.FinancialTransactionWithPaymentsAndNotes>(financialTransaction, {
                noAcceptNullable: true,
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.find.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransactionWithPaymentsAndNotes>(err, {
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
                    countRepeatedOccurrences: transaction[''],
                    createdAt: transaction[''],
                    description: transaction[''],
                    frequency: transaction[''],
                    id: transaction[''],
                    priority: transaction[''],
                    receiver: transaction[''],
                    sender: transaction[''],
                    situation: transaction[''],
                    timesToRepeat: transaction[''],
                    title: transaction[''],
                    type: transaction[''],
                    typeOccurrence: transaction[''],
                    updatedAt: transaction[''],
                    value: transaction[''],
                    bankAccountId: transaction[''],
                    dateTimeCompetence: transaction[''],
                    expiresIn: transaction[''],
                    isObservable: transaction[''],
                    isSendNotification: transaction[''],
                })))
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction[]>(err, {
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.findMany.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.findMany.failed },
            })
        }
    }

    async findMany(query: FinancialTransactionQuery) {
        try {
            const financialTransaction = await this.database.instance.financialTransaction.findFirst({
                where: { ...query.where },
            })

            return this.handleResponse<FinancialTransactionModel.FinancialTransaction>(financialTransaction)
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction>(err, {
                error: { title: FinancialTransactionRepository.GLOBAL_MESSAGE.findMany.title, message: FinancialTransactionRepository.GLOBAL_MESSAGE.findMany.failed },
            })
        }
    }
}
