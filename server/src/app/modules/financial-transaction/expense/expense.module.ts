import { Module } from '@core'
import { FinancialExpenseController } from '@modules/financial-transaction/expense/expense.controller'
import { FinancialExpenseUseCaseModule } from '@modules/financial-transaction/expense/use-case/use-case.module'

@Module({
    imports: [FinancialExpenseUseCaseModule],
    controllers: [FinancialExpenseController],
    providers: [],
})
export class FinancialExpenseModule { }
