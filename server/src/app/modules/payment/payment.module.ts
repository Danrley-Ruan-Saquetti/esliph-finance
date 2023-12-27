import { Module } from '@esliph/module'
import { PaymentController } from '@modules/payment/payment.controller'
import { PaymentRepository } from '@modules/payment/payment.repository'
import { PaymentUseCaseModule } from '@modules/payment/use-case/use-case.module'

@Module({
    imports: [PaymentUseCaseModule],
    controllers: [PaymentController],
    providers: [PaymentRepository],
})
export class PaymentModule { }
