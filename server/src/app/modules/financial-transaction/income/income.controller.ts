import { Request } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Controller, Guard } from '@esliph/module'
import { Post } from '@services/http.service'
import { FinancialTransactionCreateUseCase } from '@modules/financial-transaction/use-case/create.use-case'

@Controller({ prefix: '/financial-transactions/income' })
export class FinancialIncomeController {
    constructor(@Injection.Inject('financial-transaction.use-case.create') private createUC: FinancialTransactionCreateUseCase) { }

    @Guard({ name: 'bank-account.authorization' })
    @Post('/create')
    async create(req: Request) {
        const result = await this.createUC.perform({ ...req.body, ...req.headers })

        return result
    }
}
