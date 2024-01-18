import { Module } from '@core'
import { FinancialExpenseCreateUseCase } from '@modules/financial-transaction/expense/use-case/create.use-case'
import { FinancialExpenseQueryUseCase } from '@modules/financial-transaction/expense/use-case/query.use-case'
import { FinancialExpenseLiquidateUseCase } from '@modules/financial-transaction/expense/use-case/liquidate.use-case'

@Module({
    providers: [FinancialExpenseCreateUseCase, FinancialExpenseQueryUseCase, FinancialExpenseLiquidateUseCase],
})
export class FinancialExpenseUseCaseModule { }
