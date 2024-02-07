import { HttpStatusCodes, Request, Injection, Controller, Guard, HttpStatusCode, Domain } from '@core'
import { Get, Post } from '@services/http.service'
import { FinancialIncomeCreateUseCase } from '@modules/financial-transaction/income/use-case/create.use-case'
import { FinancialIncomeQueryUseCase } from '@modules/financial-transaction/income/use-case/query.use-case'
import { FinancialIncomeReceiveUseCase } from '@modules/financial-transaction/income/use-case/receive.use-case'

@Controller({ prefix: '/financial-transactions/income', domain: Domain.CLIENT })
export class FinancialIncomeController {
    constructor(
        @Injection.Inject('financial-income.use-case.create') private createUC: FinancialIncomeCreateUseCase,
        @Injection.Inject('financial-income.use-case.query') private queryUC: FinancialIncomeQueryUseCase,
        @Injection.Inject('financial-income.use-case.receive') private receiveUC: FinancialIncomeReceiveUseCase,
    ) { }

    @Guard({ name: 'bank-account.authorization' })
    @Get('')
    async getMany(req: Request) {
        const bankAccountId = req.headers['bankAccountId']

        const result = await this.queryUC.queryManyByBankAccountId({ bankAccountId })

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @Post('')
    @HttpStatusCode(HttpStatusCodes.CREATED)
    async create(req: Request) {
        const result = await this.createUC.perform({ ...req.body, bankAccountId: req.headers['bankAccountId'] })

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
    @Post('/:id/receive')
    async receive(req: Request) {
        const financialTransactionId = req.params['id']

        const result = await this.receiveUC.perform({ ...req.params, ...req.body, financialTransactionId })

        return result
    }
}
