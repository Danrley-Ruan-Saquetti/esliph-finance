import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { Result } from '@esliph/common'
import { ID } from '@@types'
import { GLOBAL_DTO } from '@global'
import { UseCase } from '@common/use-case'
import { ValidatorService, SchemaValidator } from '@services/validator.service'
import { CategoryRepository } from '@modules/category/category.repository'

const schemaNumber = ValidatorService.schema.coerce.number()
const schemaQuery = ValidatorService.schema.object({
    pageIndex: GLOBAL_DTO.query.pagination.pageIndex(),
    limite: GLOBAL_DTO.query.pagination.limite(),
})

export type CategoryWhereArgs = SchemaValidator.input<typeof schemaQuery>

@Service({ name: 'category.use-case.query' })
export class CategoryQueryUseCase extends UseCase {
    constructor(@Injection.Inject('category.repository') private categoryRepository: CategoryRepository) {
        super()
    }

    async queryById(args: { id: ID }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const categoryResult = await this.categoryRepository.findById(id)

        if (!categoryResult.isSuccess()) {
            return Result.failure({ ...categoryResult.getError(), title: 'Query Category' })
        }

        return Result.success(categoryResult.getValue())
    }

    async queryManyByBankAccountId(args: { bankAccountId: ID }) {
        const bankAccountId = this.validateDTO(args.bankAccountId, schemaNumber)

        const categoriesResult = await this.categoryRepository.findManyByBankAccountId(bankAccountId)

        if (!categoriesResult.isSuccess()) {
            return Result.failure({ ...categoriesResult.getError(), title: 'Query Categories' })
        }

        return Result.success(categoriesResult.getValue() || [])
    }
}
