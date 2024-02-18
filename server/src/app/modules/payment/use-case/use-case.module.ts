import { Module } from '@core'
import { PaymentCreateUseCase } from '@modules/payment/use-case/create.use-case'
import { PaymentQueryCompensationUseCase } from '@modules/payment/use-case/query-compensation.use-case'
import { PaymentQueryUseCase } from '@modules/payment/use-case/query.use-case'

@Module({
    providers: [PaymentCreateUseCase, PaymentQueryCompensationUseCase, PaymentQueryUseCase],
})
export class PaymentUseCaseModule { }
