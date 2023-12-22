import { Module } from '@esliph/module'
import { BankAccountCreateUseCase } from '@modules/bank-account/use-case/create.use-case'
import { BankAccountQueryUseCase } from '@modules/bank-account/use-case/query.use-case'
import { BankAccountGenerateCodeUseCase } from '@modules/bank-account/use-case/generate-code.use-case'

@Module({
    providers: [BankAccountCreateUseCase, BankAccountQueryUseCase, BankAccountGenerateCodeUseCase],
})
export class BankAccountUseCaseModule {}
