import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { UseCase } from '@common/use-case'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { FinancialTransactionCreateUseCase } from '@modules/financial-transaction/use-case/create.use-case'

@Service({ name: 'financial-transaction.use-case.calc-next-date-repeat' })
export class FinancialTransactionCalcNextDateRepeatUseCase extends UseCase {
    constructor() {
        super()
    }

    async perform() {

    }
}