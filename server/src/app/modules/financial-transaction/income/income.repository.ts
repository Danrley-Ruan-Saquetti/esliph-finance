import { Service } from '@esliph/module'
import { ID } from '@@types'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'

@Service({ name: 'financial-income.repository' })
export class FinancialIncomeRepository extends FinancialTransactionRepository {

}
