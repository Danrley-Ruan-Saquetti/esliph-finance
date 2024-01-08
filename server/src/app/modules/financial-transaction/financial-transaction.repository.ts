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
    async register(data: FinancialTransactionModel.Model, notes: { description: string }[] = []) {
        try {
            await this.database.instance.financialTransaction.create({
                data: {
                    ...data,
                    notes: { createMany: { data: notes } },
                },
            })

            return this.handleResponse<{ message: string }>(
                { message: 'Financial transaction successfully registered' },
                { error: { title: 'Register Financial Transaction', message: 'Financial transaction successfully registered' } },
            )
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: 'Register Financial Transaction', message: 'Unable to register financial transaction' },
            })
        }
    }

    async updateById(args: FinancialTransactionModel.UpdateArgs, where: { id: ID }) {
        try {
            await this.database.instance.financialTransaction.update({ where: { id: where.id }, data: args })

            return this.handleResponse<{ message: string }>(
                { message: 'Financial transaction successfully updated' },
                { error: { title: 'Update Financial Transaction', message: 'Financial transaction successfully updated' } },
            )
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: 'Update Financial Transaction', message: 'Unable to update financial transaction' },
            })
        }
    }

    async findById(id: ID) {
        try {
            const financialTransaction = await this.database.instance.financialTransaction.findFirst({ where: { id } })

            return this.handleResponse<FinancialTransactionModel.FinancialTransaction>(financialTransaction, {
                noAcceptNullable: true,
                error: { title: 'Find Financial Transaction', message: 'Financial transaction not found' },
            })
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction>(err, {
                error: { title: 'Find Financial Transaction', message: 'Financial transaction not found' },
            })
        }
    }

    async findByIdAndBankAccountId(id: ID, bankAccountId: ID) {
        try {
            const financialTransaction = await this.database.instance.financialTransaction.findFirst({ where: { id, bankAccountId } })

            return this.handleResponse<FinancialTransactionModel.FinancialTransaction>(financialTransaction, {
                noAcceptNullable: true,
                error: { title: 'Find Financial Transaction', message: 'Financial transaction not found' },
            })
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction>(err, {
                error: { title: 'Find Financial Transaction', message: 'Financial transaction not found' },
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
                error: { title: 'Find Financial Transaction', message: 'Financial transaction not found' },
            })
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransactionWithPayments>(err, {
                error: { title: 'Find Financial Transaction', message: 'Financial transaction not found' },
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
                error: { title: 'Find Financial Transaction', message: 'Financial transaction not found' },
            })
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransactionWithNotes>(err, {
                error: { title: 'Find Financial Transaction', message: 'Financial transaction not found' },
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
                error: { title: 'Find Financial Transaction', message: 'Financial transaction not found' },
            })
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransactionWithPaymentsAndNotes>(err, {
                error: { title: 'Find Financial Transaction', message: 'Financial transaction not found' },
            })
        }
    }

    async findManyByBankAccountId(bankAccountId: ID) {
        try {
            const financialTransactions = await this.database.instance.financialTransaction.findMany({
                where: { bankAccountId },
                orderBy: { expiresIn: 'asc' },
            })

            return this.handleResponse<FinancialTransactionModel.FinancialTransaction[]>(financialTransactions, {
                error: { title: 'Find Financial Transaction', message: 'Financial transaction not found' },
            })
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction[]>(err, {
                error: { title: 'Find Financial Transaction', message: 'Financial transaction not found' },
            })
        }
    }

    async findManyByBankAccountIdAndSituations(bankAccountId: ID, situations: FinancialTransactionModel.Situation[]) {
        try {
            const financialTransactions = await this.database.instance.financialTransaction.findMany({
                where: { bankAccountId, situation: { in: situations } },
                orderBy: { expiresIn: 'asc' },
            })

            return this.handleResponse<FinancialTransactionModel.FinancialTransaction[]>(financialTransactions, {
                error: { title: 'Find Financial Transaction', message: 'Financial transaction not found' },
            })
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction[]>(err, {
                error: { title: 'Find Financial Transaction', message: 'Financial transaction not found' },
            })
        }
    }

    async findManyByBankAccountIdAndTypes(bankAccountId: ID, types: FinancialTransactionModel.Type[]) {
        try {
            const financialTransactions = await this.database.instance.financialTransaction.findMany({
                where: { bankAccountId, type: { in: types } },
                orderBy: { expiresIn: 'asc' },
            })

            return this.handleResponse<FinancialTransactionModel.FinancialTransaction[]>(financialTransactions, {
                error: { title: 'Find Financial Transaction', message: 'Financial transaction not found' },
            })
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction[]>(err, {
                error: { title: 'Find Financial Transaction', message: 'Financial transaction not found' },
            })
        }
    }

    async findManyByBankAccountIdAndTypeOccurrence(bankAccountId: ID, typeOccurrences: FinancialTransactionModel.TypeOccurrence[]) {
        try {
            const financialTransactions = await this.database.instance.financialTransaction.findMany({
                where: { bankAccountId, typeOccurrence: { in: typeOccurrences } },
                orderBy: { expiresIn: 'asc' },
            })

            return this.handleResponse<FinancialTransactionModel.FinancialTransaction[]>(financialTransactions, {
                error: { title: 'Find Financial Transaction', message: 'Financial transaction not found' },
            })
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction[]>(err, {
                error: { title: 'Find Financial Transaction', message: 'Financial transaction not found' },
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
                    isSendNotification: transaction['is_send_notification'],
                })),
                { error: { title: 'Find Financial Transaction', message: 'Financial transaction not found' } },
            )
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction[]>(err, {
                error: { title: 'Find Financial Transaction', message: 'Financial transaction not found' },
            })
        }
    }

    async findMany(query: FinancialTransactionQuery) {
        try {
            const financialTransaction = await this.database.instance.financialTransaction.findFirst({
                where: { ...query.where },
                skip: this.calcSkipRegister(query.page),
                take: query.page.limite,
            })

            return this.handleResponse<FinancialTransactionModel.FinancialTransaction>(financialTransaction, {
                error: { title: 'Find Financial Transaction', message: 'Financial transaction not found' },
            })
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction>(err, {
                error: { title: 'Find Financial Transaction', message: 'Financial transaction not found' },
            })
        }
    }
}
