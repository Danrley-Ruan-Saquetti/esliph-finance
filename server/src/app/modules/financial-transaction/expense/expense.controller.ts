import { HttpStatusCodes, Request, Injection, Controller, Guard, HttpStatusCode, Domain } from '@core'
import { Get, Post } from '@services/http.service'
import { FinancialExpenseCreateUseCase } from '@modules/financial-transaction/expense/use-case/create.use-case'
import { FinancialExpenseLiquidateUseCase } from '@modules/financial-transaction/expense/use-case/liquidate.use-case'
import { FinancialExpenseQueryUseCase } from '@modules/financial-transaction/expense/use-case/query.use-case'

@Controller({ prefix: '/financial-transactions/expense', domain: Domain.CLIENT })
export class FinancialExpenseController {
    constructor(
        @Injection.Inject('financial-expense.use-case.create') private createUC: FinancialExpenseCreateUseCase,
        @Injection.Inject('financial-expense.use-case.query') private queryUC: FinancialExpenseQueryUseCase,
        @Injection.Inject('financial-expense.use-case.liquidate') private liquidateUC: FinancialExpenseLiquidateUseCase,
    ) { }

    @Guard({ name: 'bank-account.authorization' })
    @Get('')
    async getMany(req: Request) {
        const bankAccountId = req.headers['bankAccountId']

        const result = await this.queryUC.queryManyByBankAccountId({ bankAccountId })

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @HttpStatusCode(HttpStatusCodes.CREATED)
    @Post('')
    async create(req: Request) {
        const result = await this.createUC.perform({ ...req.body, ...req.headers })

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @Get('/:id')
    async get(req: Request) {
        const id = req.params['id']

        const result = await this.queryUC.queryByIdAndBankAccountIdWithPaymentsAndNotes({ id })

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @Post('/:id/liquidate')
    async liquidate(req: Request) {
        const financialTransactionId = req.params['id']

        const result = await this.liquidateUC.perform({ ...req.params, ...req.body, financialTransactionId })

        return result
    }
}
