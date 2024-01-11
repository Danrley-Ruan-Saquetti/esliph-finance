import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { Result } from '@esliph/common'
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

    async queryByIdWithAddressAndContacts(args: { id: ID }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const peopleResult = await this.peopleRepository.findByIdWithAddressAndContacts(id)

        if (!peopleResult.isSuccess()) {
            return Result.failure({ ...peopleResult.getError(), title: 'Query People' })
        }

        return Result.success(peopleResult.getValue())
    }
}
