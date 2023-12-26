import { Service } from '@esliph/module'
import { ID } from '@@types'
import { Repository } from '@services/repository.service'

@Service({ name: 'financial-income.repository' })
export class FinancialIncomeRepository extends Repository {

}
