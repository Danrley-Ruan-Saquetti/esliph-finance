import { Module } from '@esliph/module'
import { FinancialCategoryQueryUseCase } from '@modules/financial-transaction/category/use-case/query.use-case'

@Module({
    providers: [FinancialCategoryQueryUseCase],
})
export class FinancialCategoryUseCaseModule { }
