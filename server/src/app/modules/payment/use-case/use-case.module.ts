import { Module } from '@esliph/module'
import { PaymentCreateUseCase } from '@modules/payment/use-case/create.use-case'

@Module({
    providers: [PaymentCreateUseCase],
})
export class PaymentUseCaseModule { }
