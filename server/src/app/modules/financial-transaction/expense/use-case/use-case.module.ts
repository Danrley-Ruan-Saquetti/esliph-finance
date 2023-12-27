import { Module } from '@esliph/module'
import { FinancialExpenseCreateUseCase } from '@modules/financial-transaction/expense/use-case/create.use-case'
import { FinancialExpenseQueryUseCase } from '@modules/financial-transaction/expense/use-case/query.use-case'

@Module({
    providers: [FinancialExpenseCreateUseCase, FinancialExpenseQueryUseCase],
})
export class FinancialExpenseUseCaseModule { }
