import { Module } from '@core'
import { FinancialTransactionAdminController } from '@modules/financial-transaction/financial-transaction.admin.controller'
import { FinancialTransactionCustomerController } from '@modules/financial-transaction/financial-transaction.customer.controller'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { FinancialTransactionUseCaseModule } from '@modules/financial-transaction/use-case/use-case.module'
import { FinancialIncomeModule } from '@modules/financial-transaction/income/income.module'
import { FinancialExpenseModule } from '@modules/financial-transaction/expense/expense.module'
import { CalcDateRepeatControl } from '@modules/financial-transaction/control/calc-date-repeat.control'
import { FinancialCategoryModule } from '@modules/financial-transaction/category/category.module'

@Module({
    imports: [FinancialTransactionUseCaseModule, FinancialIncomeModule, FinancialExpenseModule, FinancialCategoryModule],
    controllers: [FinancialTransactionCustomerController, FinancialTransactionAdminController],
    providers: [FinancialTransactionRepository, CalcDateRepeatControl],
})
export class FinancialTransactionModule { }
