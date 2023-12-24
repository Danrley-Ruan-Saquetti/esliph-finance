import { Module } from '@esliph/module'
import { FinancialTransactionCreateUseCase } from '@modules/financial-transaction/use-case/create.use-case'

@Module({
    providers: [FinancialTransactionCreateUseCase],
})
export class FinancialTransactionUseCaseModule { }
