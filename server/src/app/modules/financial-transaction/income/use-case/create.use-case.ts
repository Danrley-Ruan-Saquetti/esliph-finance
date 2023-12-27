import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { UseCase } from '@common/use-case'
import { FinancialTransactionCreateDTOArgs, FinancialTransactionCreateUseCase } from '@modules/financial-transaction/use-case/create.use-case'

@Service({ name: 'financial-income.use-case.create' })
export class FinancialIncomeCreateUseCase extends UseCase {
    constructor(@Injection.Inject('financial-transaction.use-case.create') private createUC: FinancialTransactionCreateUseCase) {
        super()
    }

    async perform(args: FinancialTransactionCreateDTOArgs) {
        const result = await this.createUC.perform(args)

        return result
    }
}
