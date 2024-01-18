import { Module } from '@core'
import { FinancialIncomeCreateUseCase } from '@modules/financial-transaction/income/use-case/create.use-case'
import { FinancialIncomeQueryUseCase } from '@modules/financial-transaction/income/use-case/query.use-case'
import { FinancialIncomeReceiveUseCase } from '@modules/financial-transaction/income/use-case/receive.use-case'

@Module({
    providers: [FinancialIncomeCreateUseCase, FinancialIncomeQueryUseCase, FinancialIncomeReceiveUseCase],
})
export class FinancialIncomeUseCaseModule { }
