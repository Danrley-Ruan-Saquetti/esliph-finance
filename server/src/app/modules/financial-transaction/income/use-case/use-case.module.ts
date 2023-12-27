import { Module } from '@esliph/module'
import { FinancialIncomeCreateUseCase } from '@modules/financial-transaction/income/use-case/create.use-case'

@Module({
    providers: [FinancialIncomeCreateUseCase],
})
export class FinancialIncomeUseCaseModule { }
