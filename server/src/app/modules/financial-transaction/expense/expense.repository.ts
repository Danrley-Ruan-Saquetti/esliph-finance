import { Service } from '@esliph/module'
import { ID } from '@@types'
import { Repository } from '@services/repository.service'

@Service({ name: 'financial-expense.repository' })
export class FinancialExpenseRepository extends Repository {

}
