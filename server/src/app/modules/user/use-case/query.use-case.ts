import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { Result } from '@esliph/common'
import { UseCase } from '@common/use-case'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { UserRepository } from '@modules/user/user.repository'

const schemaNumber = ValidatorService.schema.coerce.number()

@Service({ name: 'user.use-case.query' })
export class UserQueryUseCase extends UseCase {
    constructor(@Injection.Inject('user.repository') private repository: UserRepository) {
        super()
    }

    async queryByIdWithoutPassword(args: { id: SchemaValidator.input<typeof schemaNumber> }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const bankAccountResult = await this.repository.findByIdWithoutPassword(id)

        if (!bankAccountResult.isSuccess()) {
            if (bankAccountResult.isErrorInOperation()) {
                return Result.failure({ title: 'Query User', message: 'Unable to query user' })
            }

            return Result.failure({ title: 'Query User', message: 'Bank account not found' })
        }

        return Result.success(bankAccountResult.getValue())
    }
}
