import { Request, Injection, Get, Put, Controller, Guard, Domain } from '@core'
import { FinancialTransactionQueryUseCase } from '@modules/financial-transaction/use-case/query.use-case'

@Controller({ prefix: '/financial-transactions', domain: Domain.ADMIN })
export class FinancialTransactionAdminController {
    constructor(
        @Injection.Inject('financial-transaction.use-case.query') private queryUC: FinancialTransactionQueryUseCase,
    ) { }

    @Guard({ name: 'admin.authorization' })
    @Get('')
    async get(req: Request) {
        const filters = req.params as any

        const result = await this.queryUC.query({ ...filters })

        return result
    }
}
