import { Injection, Service, Result } from '@core'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { SchemaValidator } from '@services/validator.service'
import { FinancialCategoryRepository } from '@modules/financial-transaction/category/category.repository'

const schemaNumber = SchemaValidator.coerce.number()

@Service({ name: 'financial-category.use-case.query' })
export class FinancialCategoryQueryUseCase extends UseCase {
    constructor(@Injection.Inject('financial-category.repository') private categoryRepository: FinancialCategoryRepository) {
        super()
    }

    async queryManyByIdsAndBankAccountId(args: { id: ID }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const financialCategoriesResult = await this.categoryRepository.findManyByIdsAndBankAccountIdWithCategoryAndTransaction([], id)

        if (!financialCategoriesResult.isSuccess()) {
            return Result.failure({ ...financialCategoriesResult.getError(), title: 'Query Financial Category' })
        }

        return Result.success(financialCategoriesResult.getValue())
    }
}
