import { Module } from '@esliph/module'
import { FinancialTransactionCreateUseCase } from '@modules/financial-transaction/use-case/create.use-case'
import { FinancialTransactionQueryUseCase } from '@modules/financial-transaction/use-case/query.use-case'
import { FinancialTransactionUpdateSituationLateUseCase } from '@modules/financial-transaction/use-case/update-situation-late.use-case'
import { FinancialTransactionDuplicateTransactionsRepeatUseCase } from '@modules/financial-transaction/use-case/duplicate-transactions-repeat.use-case.ts'

@Module({
    providers: [FinancialTransactionCreateUseCase, FinancialTransactionQueryUseCase, FinancialTransactionUpdateSituationLateUseCase, FinancialTransactionDuplicateTransactionsRepeatUseCase],
})
export class FinancialTransactionUseCaseModule { }
