import * as Database from '@services/database.service'
import { DocumentSimple } from '@@types'
import { CategoryModel } from '@modules/category/category.model'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'

export namespace FinancialCategoryModel {
    export type FinancialCategory = Database.FinancialTransactionCategory
    export type Model = DocumentSimple<FinancialCategory>
    export type FinancialCategoryWithCategory = FinancialCategory & {
        category: CategoryModel.Category
    }
    export type FinancialCategoryWithFinancialTransaction = FinancialCategory & {
        financialTransaction: FinancialTransactionModel.FinancialTransaction
    }
    export type FinancialCategoryWithCategoryAndFinancialTransaction = FinancialCategoryWithCategory & FinancialCategoryWithFinancialTransaction

}
