import { Controller, Domain, Get, Guard, Injection, Request } from '@core'
import { PaymentQueryUseCase } from '@modules/payment/use-case/query.use-case'

@Controller({ prefix: '/payments', domain: Domain.ADMIN })
export class PaymentAdminController {
    constructor(
        @Injection.Inject('payment.use-case.query') private queryUC: PaymentQueryUseCase,
    ) { }

    @Guard({ name: 'admin.authorization' })
    @Get('')
    async get(req: Request) {
        const filters = req.params as any

        const result = await this.queryUC.query({ ...filters })

        return result
    }
}
