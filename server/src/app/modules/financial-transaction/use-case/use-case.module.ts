import { Module } from '@core'
import { FinancialTransactionCreateUseCase } from '@modules/financial-transaction/use-case/create.use-case'
import { FinancialTransactionQueryUseCase } from '@modules/financial-transaction/use-case/query.use-case'
import { FinancialTransactionUpdateSituationLateUseCase } from '@modules/financial-transaction/use-case/update-situation-late.use-case'
import { FinancialTransactionUpdateUseCase } from '@modules/financial-transaction/use-case/update.use-case'
import { FinancialTransactionDuplicateTransactionsRepeatUseCase } from '@modules/financial-transaction/use-case/duplicate-transactions-repeat.use-case.ts'

@Module({
    providers: [FinancialTransactionCreateUseCase, FinancialTransactionQueryUseCase, FinancialTransactionUpdateSituationLateUseCase, FinancialTransactionDuplicateTransactionsRepeatUseCase, FinancialTransactionUpdateUseCase],
})
export class FinancialTransactionUseCaseModule { }
