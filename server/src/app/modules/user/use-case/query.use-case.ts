import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { Result } from '@esliph/common'
import { UseCase } from '@common/use-case'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { UserRepository } from '@modules/user/user.repository'

const schemaNumber = ValidatorService.schema.coerce.number()

@Service({ name: 'user.use-case.query' })
export class UserQueryUseCase extends UseCase {
    constructor(@Injection.Inject('user.repository') private userRepository: UserRepository) {
        super()
    }

    async queryByIdWithoutPassword(args: { id: SchemaValidator.input<typeof schemaNumber> }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const bankAccountResult = await this.userRepository.findByIdWithoutPassword(id)

        if (!bankAccountResult.isSuccess()) {
            return Result.failure({
                ...bankAccountResult.getError(), title: 'Query User'
            })
        }

        return Result.success(bankAccountResult.getValue())
    }

    async queryWithPeopleByIdWithoutPassword(args: { id: SchemaValidator.input<typeof schemaNumber> }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const bankAccountResult = await this.userRepository.findByIdWithoutPasswordWithPeople(id)

        if (!bankAccountResult.isSuccess()) {
            return Result.failure({
                ...bankAccountResult.getError(), title: 'Query User'
            })
        }

        return Result.success(bankAccountResult.getValue())
    }
}
