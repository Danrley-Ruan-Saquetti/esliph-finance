import { Injection, Service } from '@core'
import { UseCase } from '@common/use-case'
import { SchemaValidator } from '@services/validator.service'
import { MailRepository } from '@modules/notification/mail/mail.repository'

const schemaNumber = SchemaValidator.coerce.number()

@Service({ name: 'mail.use-case.query' })
export class MailQueryUseCase extends UseCase {
    constructor(@Injection.Inject('mail.repository') private mailRepository: MailRepository) {
        super()
    }
}
