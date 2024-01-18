import { Module } from '@core'
import { PaymentCreateUseCase } from '@modules/payment/use-case/create.use-case'
import { PaymentQueryCompensationUseCase } from '@modules/payment/use-case/query-compensation.use-case'

@Module({
    providers: [PaymentCreateUseCase, PaymentQueryCompensationUseCase],
})
export class PaymentUseCaseModule { }
