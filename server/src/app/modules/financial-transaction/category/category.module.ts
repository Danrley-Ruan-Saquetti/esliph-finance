import { Module } from '@esliph/module'
import { FinancialCategoryRepository } from '@modules/financial-transaction/category/category.repository'
import { FinancialCategoryUseCaseModule } from '@modules/financial-transaction/category/use-case/use-case.module'

@Module({
    imports: [FinancialCategoryUseCaseModule],
    controllers: [],
    providers: [FinancialCategoryRepository],
})
export class FinancialCategoryModule { }
