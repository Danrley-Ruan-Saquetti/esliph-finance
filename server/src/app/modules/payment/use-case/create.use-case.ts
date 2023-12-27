import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { GLOBAL_DTO } from '@global'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { PaymentRepository } from '@modules/payment/payment.repository'
import { GLOBAL_PAYMENT_DTO } from '@modules/payment/payment.global'

const schemaDTO = ValidatorService.schema.object({})

export type PaymentCreateDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'payment.use-case.create' })
export class PaymentCreateUseCase extends UseCase {
    constructor(@Injection.Inject('payment.repository') private repository: PaymentRepository) {
        super()
    }

    async perform(args: PaymentCreateDTOArgs) {
        const { } = this.validateDTO(args, schemaDTO)

        return Result.success({ message: 'Payment registered successfully' })
    }
}
