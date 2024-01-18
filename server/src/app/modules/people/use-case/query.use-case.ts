import { Injection, Service, Result } from '@core'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { ValidatorService } from '@services/validator.service'
import { PeopleRepository } from '@modules/people/people.repository'

const schemaNumber = ValidatorService.schema.coerce.number()

@Service({ name: 'people.use-case.query' })
export class PeopleQueryUseCase extends UseCase {
    constructor(@Injection.Inject('people.repository') private peopleRepository: PeopleRepository) {
        super()
    }
}
