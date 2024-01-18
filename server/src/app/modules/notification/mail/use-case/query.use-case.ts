import { Injection } from '@core'
import { Service } from '@core'
import { Result } from '@core'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { ValidatorService } from '@services/validator.service'
import { MailRepository } from '@modules/notification/mail/mail.repository'

const schemaNumber = ValidatorService.schema.coerce.number()

@Service({ name: 'mail.use-case.query' })
export class MailQueryUseCase extends UseCase {
    constructor(@Injection.Inject('mail.repository') private mailRepository: MailRepository) {
        super()
    }
}
