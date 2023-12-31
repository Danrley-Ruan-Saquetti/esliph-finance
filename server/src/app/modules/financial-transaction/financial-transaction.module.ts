import { Module } from '@esliph/module'
import { FinancialTransactionController } from '@modules/financial-transaction/financial-transaction.controller'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { FinancialTransactionUseCaseModule } from '@modules/financial-transaction/use-case/use-case.module'
import { FinancialIncomeModule } from '@modules/financial-transaction/income/income.module'
import { FinancialExpenseModule } from '@modules/financial-transaction/expense/expense.module'
import { CalcDateRepeatControl } from '@modules/financial-transaction/control/calc-date-repeat.control'

@Module({
    imports: [FinancialTransactionUseCaseModule, FinancialIncomeModule, FinancialExpenseModule],
    controllers: [FinancialTransactionController],
    providers: [FinancialTransactionRepository, CalcDateRepeatControl],
})
export class FinancialTransactionModule { }
