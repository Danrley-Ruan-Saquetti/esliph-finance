import { Module } from '@esliph/module'
import { FinancialExpenseController } from '@modules/financial-transaction/expense/expense.controller'
import { FinancialExpenseRepository } from '@modules/financial-transaction/expense/expense.repository'
import { FinancialExpenseUseCaseModule } from '@modules/financial-transaction/expense/use-case/use-case.module'

@Module({
    imports: [FinancialExpenseUseCaseModule],
    controllers: [FinancialExpenseController],
    providers: [FinancialExpenseRepository],
})
export class FinancialExpenseModule { }
