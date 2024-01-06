import { Module } from '@esliph/module'
import { BankAccountCreateUseCase } from '@modules/bank-account/use-case/create.use-case'
import { BankAccountQueryUseCase } from '@modules/bank-account/use-case/query.use-case'
import { BankAccountGenerateCodeUseCase } from '@modules/bank-account/use-case/generate-code.use-case'
import { BankAccountBelongUseCase } from '@modules/bank-account/use-case//belong.use-case'

@Module({
    providers: [BankAccountCreateUseCase, BankAccountQueryUseCase, BankAccountGenerateCodeUseCase, BankAccountBelongUseCase],
})
export class BankAccountUseCaseModule { }
