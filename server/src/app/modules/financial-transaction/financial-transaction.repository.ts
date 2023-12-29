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
    async register(data: FinancialTransactionModel.Model) {
        try {
            await this.database.instance.financialTransaction.create({ data })

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

    async updateById(args: Partial<FinancialTransactionModel.Model>, where: { id: ID }) {
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

    async findByIdWithPayments(id: ID) {
        try {
            const financialTransaction = await this.database.instance.financialTransaction.findFirst({ where: { id }, include: { payments: { orderBy: { paidAt: 'desc' } } } })

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

    async findManyByBankAccountId(bankAccountId: ID) {
        try {
            const financialTransactions = await this.database.instance.financialTransaction.findMany({
                where: { bankAccountId },
                orderBy: { expiresIn: 'asc' }
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

    async findMany(query: FinancialTransactionQuery) {
        try {
            const financialTransaction = await this.database.instance.financialTransaction.findFirst({
                where: { ...query.where },
                skip: this.calcSkipRegister(query.page),
                take: query.page.limite
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
