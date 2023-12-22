import { Module } from '@esliph/module'
import { FinancialTransactionController } from '@modules/financial-transaction/financial-transaction.controller'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { FinancialTransactionUseCaseModule } from '@modules/financial-transaction/use-case/use-case.module'

@Module({
    imports: [FinancialTransactionUseCaseModule],
    controllers: [FinancialTransactionController],
    providers: [FinancialTransactionRepository],
})
export class FinancialTransactionModule {}
