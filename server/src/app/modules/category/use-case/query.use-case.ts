import { Injection, Service, Result } from '@core'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { ValidatorService } from '@services/validator.service'
import { CategoryRepository } from '@modules/category/category.repository'

const schemaNumber = ValidatorService.schema.coerce.number()

@Service({ name: 'category.use-case.query' })
export class CategoryQueryUseCase extends UseCase {
    constructor(@Injection.Inject('category.repository') private categoryRepository: CategoryRepository) {
        super()
    }

    async queryById(args: { id: ID }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const categoryResult = await this.categoryRepository.findUnique({ where: { id } })

        if (!categoryResult.isSuccess()) {
            return Result.failure({ ...categoryResult.getError(), title: 'Query Category' })
        }

        return Result.success(categoryResult.getValue())
    }

    async queryByIdAndBankAccountId(args: { id: ID, bankAccountId: ID }) {
        const id = this.validateDTO(args.id, schemaNumber)
        const bankAccountId = this.validateDTO(args.bankAccountId, schemaNumber)

        const categoryResult = await this.categoryRepository.findUnique({ where: { id, bankAccountId } })

        if (!categoryResult.isSuccess()) {
            return Result.failure({ ...categoryResult.getError(), title: 'Query Category' })
        }

        return Result.success(categoryResult.getValue())
    }

    async queryManyByBankAccountId(args: { bankAccountId: ID }) {
        const bankAccountId = this.validateDTO(args.bankAccountId, schemaNumber)

        const categoriesResult = await this.categoryRepository.findMany({ where: { bankAccountId } })

        if (!categoriesResult.isSuccess()) {
            return Result.failure({ ...categoriesResult.getError(), title: 'Query Categories' })
        }

        return Result.success(categoriesResult.getValue() || [])
    }
}
