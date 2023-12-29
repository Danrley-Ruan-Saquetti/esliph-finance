import { Module } from '@esliph/module'
import { PaymentController } from '@modules/payment/payment.controller'
import { PaymentRepository } from '@modules/payment/payment.repository'
import { PaymentUseCaseModule } from '@modules/payment/use-case/use-case.module'
import { CompensationPaymentsControl } from '@modules/payment/control/compensation-payments.control'

@Module({
    imports: [PaymentUseCaseModule],
    controllers: [PaymentController],
    providers: [PaymentRepository, CompensationPaymentsControl],
})
export class PaymentModule { }
