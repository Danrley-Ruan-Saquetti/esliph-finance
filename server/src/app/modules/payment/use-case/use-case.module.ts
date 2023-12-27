import { Module } from '@esliph/module'
import { PaymentCreateUseCase } from '@modules/payment/use-case/create.use-case'
import { PaymentQueryCompensationUseCase } from '@modules/payment/use-case/query-compensation.use-case'

@Module({
    providers: [PaymentCreateUseCase, PaymentQueryCompensationUseCase],
})
export class PaymentUseCaseModule { }
