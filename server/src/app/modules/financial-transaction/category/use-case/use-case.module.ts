import { Module } from '@core'
import { FinancialCategoryQueryUseCase } from '@modules/financial-transaction/category/use-case/query.use-case'

@Module({
    providers: [FinancialCategoryQueryUseCase],
})
export class FinancialCategoryUseCaseModule { }
