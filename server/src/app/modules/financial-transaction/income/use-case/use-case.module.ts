import { Module } from '@esliph/module'
import { FinancialIncomeCreateUseCase } from '@modules/financial-transaction/income/use-case/create.use-case'
import { FinancialIncomeQueryUseCase } from '@modules/financial-transaction/income/use-case/query.use-case'

@Module({
    providers: [FinancialIncomeCreateUseCase, FinancialIncomeQueryUseCase],
})
export class FinancialIncomeUseCaseModule { }
