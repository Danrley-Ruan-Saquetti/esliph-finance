import { Module } from '@esliph/module'
import { FinancialIncomeController } from '@modules/financial-transaction/income/income.controller'
import { FinancialIncomeUseCaseModule } from '@modules/financial-transaction/income/use-case/use-case.module'

@Module({
    imports: [FinancialIncomeUseCaseModule],
    controllers: [FinancialIncomeController],
    providers: [],
})
export class FinancialIncomeModule { }
