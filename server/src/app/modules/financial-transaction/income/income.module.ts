import { Module } from '@esliph/module'
import { FinancialIncomeController } from '@modules/financial-transaction/income/income.controller'
import { FinancialIncomeRepository } from '@modules/financial-transaction/income/income.repository'
import { FinancialIncomeUseCaseModule } from '@modules/financial-transaction/income/use-case/use-case.module'

@Module({
    imports: [FinancialIncomeUseCaseModule],
    controllers: [FinancialIncomeController],
    providers: [FinancialIncomeRepository],
})
export class FinancialIncomeModule { }
