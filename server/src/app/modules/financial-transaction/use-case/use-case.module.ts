import { Module } from '@esliph/module'
import { FinancialTransactionCreateUseCase } from '@modules/financial-transaction/use-case/create.use-case'
import { FinancialTransactionQueryUseCase } from '@modules/financial-transaction/use-case/query.use-case'

@Module({
    providers: [FinancialTransactionCreateUseCase, FinancialTransactionQueryUseCase],
})
export class FinancialTransactionUseCaseModule { }
