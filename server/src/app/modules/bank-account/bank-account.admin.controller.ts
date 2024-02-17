import { Controller, Guard, HttpStatusCode, HttpStatusCodes, Request, Injection, Domain } from '@core'
import { Get, Post } from '@services/http.service'
import { BankAccountQueryUseCase } from '@modules/bank-account/use-case/query.use-case'

@Controller({ prefix: '/bank-accounts', domain: Domain.ADMIN })
export class BankAccountAdminController {
    constructor(
        @Injection.Inject('bank-account.use-case.query') private queryUC: BankAccountQueryUseCase,
    ) { }

    @Guard({ name: 'admin.authorization' })
    @Get('')
    async get(req: Request) {
        const result = await this.queryUC.query({ ...req.params })

        return result
    }
}
