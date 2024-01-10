import { Module } from '@esliph/module'
import { BankAccountCreateUseCase } from '@modules/bank-account/use-case/create.use-case'
import { BankAccountQueryUseCase } from '@modules/bank-account/use-case/query.use-case'
import { BankAccountGenerateCodeUseCase } from '@modules/bank-account/use-case/generate-code.use-case'
import { BankAccountBelongUseCase } from '@modules/bank-account/use-case/belong.use-case'
import { BankAccountQueryBalanceUseCase } from '@modules/bank-account/use-case/query-balance.use-case'
import { BankAccountUpdateBalanceUseCase } from '@modules/bank-account/use-case/update-balance.use-case'

@Module({
    providers: [BankAccountCreateUseCase, BankAccountQueryUseCase, BankAccountGenerateCodeUseCase, BankAccountBelongUseCase, BankAccountQueryBalanceUseCase, BankAccountUpdateBalanceUseCase],
})
export class BankAccountUseCaseModule { }
