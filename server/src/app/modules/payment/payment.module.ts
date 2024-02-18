import { Module } from '@core'
import { PaymentClientController } from '@app/modules/payment/payment.client.controller'
import { PaymentAdminController } from '@modules/payment/payment.admin.controller'
import { PaymentRepository } from '@modules/payment/payment.repository'
import { PaymentUseCaseModule } from '@modules/payment/use-case/use-case.module'
import { CompensationPaymentsControl } from '@modules/payment/control/compensation-payments.control'

@Module({
    imports: [PaymentUseCaseModule],
    controllers: [PaymentClientController, PaymentAdminController],
    providers: [PaymentRepository, CompensationPaymentsControl],
})
export class PaymentModule { }
