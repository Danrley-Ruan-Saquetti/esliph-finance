import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { UseCase } from '@common/use-case'
import { PaymentCreateUseCase, PaymentCreateDTOArgs } from '@modules/payment/use-case/create.use-case'

export type FinancialIncomeReceiveDTOArgs = PaymentCreateDTOArgs

@Service({ name: 'financial-income.use-case.receive' })
export class FinancialIncomeReceiveUseCase extends UseCase {
    constructor(@Injection.Inject('payment.use-case.create') private createUC: PaymentCreateUseCase) {
        super()
    }

    async perform(args: FinancialIncomeReceiveDTOArgs) {
        const result = await this.createUC.perform({ ...args })

        return result
    }
}
