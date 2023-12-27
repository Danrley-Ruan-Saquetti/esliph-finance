import { Request } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Controller, Guard } from '@esliph/module'
import { Get, Post } from '@services/http.service'
import { FinancialTransactionCreateUseCase } from '@modules/financial-transaction/use-case/create.use-case'
import { FinancialIncomeQueryUseCase } from '@modules/financial-transaction/income/use-case/query.use-case'

@Controller({ prefix: '/financial-transactions/income' })
export class FinancialIncomeController {
    constructor(
        @Injection.Inject('financial-transaction.use-case.create') private createUC: FinancialTransactionCreateUseCase,
        @Injection.Inject('financial-income.use-case.query') private queryUC: FinancialIncomeQueryUseCase,
    ) { }

    @Guard({ name: 'bank-account.authorization' })
    @Get('')
    async getMany(req: Request) {
        const bankAccountId = req.headers['bankAccountId']

        const result = await this.queryUC.queryManyByIdBankAccount({ bankAccountId })

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @Post('/create')
    async create(req: Request) {
        const result = await this.createUC.perform({ ...req.body, ...req.headers })

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @Get('/:id')
    async get(req: Request) {
        const id = req.params['id']
        const bankAccountId = req.headers['bankAccountId']

        const result = await this.queryUC.queryByIdAndIdBankAccount({ id, bankAccountId })

        return result
    }
}
