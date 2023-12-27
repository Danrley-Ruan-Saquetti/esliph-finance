import { Request } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Get } from '@esliph/adapter-fastify'
import { Controller, Guard } from '@esliph/module'
import { PaymentQueryCompensationUseCase } from '@modules/payment/use-case/query-compensation.use-case'

@Controller({ prefix: '/financial-transactions' })
export class FinancialTransactionController {
    constructor(@Injection.Inject('payment.use-case.query-compensation') private queryCompensationUC: PaymentQueryCompensationUseCase) { }

    @Guard({ name: 'bank-account.authorization' })
    @Get('/:id/compensation')
    async getCompensation(req: Request) {
        const financialTransactionId = req.params['id']

        const result = await this.queryCompensationUC.perform({ financialTransactionId })

        return result
    }
}
