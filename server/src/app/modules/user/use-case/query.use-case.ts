import { Injection, Service, Result } from '@core'
import { UseCase } from '@common/use-case'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { PeopleModel } from '@modules/people/people.model'
import { UserRepository } from '@modules/user/user.repository'
import { UserModel } from '@modules/user/user.model'

const schemaNumber = ValidatorService.schema.coerce.number()

@Service({ name: 'user.use-case.query' })
export class UserQueryUseCase extends UseCase {
    constructor(@Injection.Inject('user.repository') private userRepository: UserRepository) {
        super()
    }

    async queryByIdWithoutPassword(args: { id: SchemaValidator.input<typeof schemaNumber> }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const bankAccountResult = await this.userRepository.findUnique({ where: { id }, select: UserModel.UserWithoutPasswordSelect })

        if (!bankAccountResult.isSuccess()) {
            return Result.failure({ ...bankAccountResult.getError(), title: 'Query User' })
        }

        return Result.success(bankAccountResult.getValue())
    }

    async queryWithPeopleByIdWithoutPassword(args: { id: SchemaValidator.input<typeof schemaNumber> }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const bankAccountResult = await this.userRepository.findUnique({ where: { id }, select: { ...UserModel.UserWithoutPasswordSelect, active: false, people: { select: { ...PeopleModel.PeopleSimpleSelect, active: false } } } })

        if (!bankAccountResult.isSuccess()) {
            return Result.failure({ ...bankAccountResult.getError(), title: 'Query User' })
        }

        return Result.success(bankAccountResult.getValue())
    }
}
