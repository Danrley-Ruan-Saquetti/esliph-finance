import { Service } from '@esliph/module'
import { ID } from '@@types'
import { Repository } from '@services/repository.service'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'
import { FinancialCategoryModel } from '@modules/financial-transaction/category/category.model'

@Service({ name: 'financial-category.repository' })
export class FinancialCategoryRepository extends Repository {
    private static GLOBAL_MESSAGE = {
        create: {
            title: 'Register Financial Category',
            success: 'Financial category successfully registered',
            failed: 'Failed to register financial category'
        },
        find: {
            title: 'Find Financial Category',
            notFound: 'Financial category not found',
            failed: 'Unable to query financial category'
        },
        findMany: {
            title: 'Find Financial Categories',
            failed: 'Unable to query financial categories'
        }
    }

    async register({ financialTransactionId, categories = [] }: { financialTransactionId: ID, categories: number[] }) {
        try {
            await this.database.instance.financialTransactionCategory.createMany({
                data: categories.map(categoryId => ({ financialTransactionId, categoryId })),
                skipDuplicates: true
            })

            return this.handleResponse<{ message: string }>({ message: FinancialCategoryRepository.GLOBAL_MESSAGE.create.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: FinancialCategoryRepository.GLOBAL_MESSAGE.create.title, message: FinancialCategoryRepository.GLOBAL_MESSAGE.create.failed },
            })
        }
    }

    async findById(id: ID) {
        try {
            const financialTransaction = await this.database.instance.financialTransaction.findFirst({ where: { id } })

            return this.handleResponse<FinancialTransactionModel.FinancialTransaction>(financialTransaction, {
                noAcceptNullable: true,
                error: { title: FinancialCategoryRepository.GLOBAL_MESSAGE.find.title, message: FinancialCategoryRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<FinancialTransactionModel.FinancialTransaction>(err, {
                error: { title: FinancialCategoryRepository.GLOBAL_MESSAGE.find.title, message: FinancialCategoryRepository.GLOBAL_MESSAGE.find.failed },
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
                error: { title: FinancialCategoryRepository.GLOBAL_MESSAGE.findMany.title, message: FinancialCategoryRepository.GLOBAL_MESSAGE.findMany.failed },
            })
        }
    }

    async findManyByIdsAndBankAccountIdWithCategoryAndTransaction(ids: ID[], bankAccountId: ID) {
        try {
            const financialTransactions = await this.database.instance.financialTransactionCategory.findMany({
                where: {
                    financialTransaction: { bankAccountId },
                    categoryId: { in: ids }
                },
                include: {
                    category: true,
                    financialTransaction: true
                }
            })

            return this.handleResponse<FinancialCategoryModel.FinancialCategoryWithCategoryAndFinancialTransaction[]>(financialTransactions)
        } catch (err: any) {
            return this.handleError<FinancialCategoryModel.FinancialCategoryWithCategoryAndFinancialTransaction[]>(err, {
                error: { title: FinancialCategoryRepository.GLOBAL_MESSAGE.findMany.title, message: FinancialCategoryRepository.GLOBAL_MESSAGE.findMany.failed },
            })
        }
    }
}
