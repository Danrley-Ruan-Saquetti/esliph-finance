import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { ID } from '@@types'
import { BankAccountRepository } from '@modules/bank-account/bank-account.repository'
import { Result } from '@esliph/common'

@Service({ name: 'bank-account.use-case.query' })
export class BankAccountQueryUseCase {
    constructor(@Injection.Inject('bank-account.repository') private repository: BankAccountRepository) {}

    async queryByIdWithoutPassword(args: { id: ID }) {
        const bankAccountResult = await this.repository.findByIdWithoutPassword(args.id)

        if (!bankAccountResult.isSuccess()) {
            if (bankAccountResult.isErrorInOperation()) {
                return Result.failure({ title: 'Query Bank Account', message: 'Unable to query bank account' })
            }

            return Result.failure({ title: 'Query Bank Account', message: 'Bank account not found' })
        }

        return Result.success(bankAccountResult.getStatus())
    }

    async queryManyByIdUserWithoutPassword(args: { userId: ID }) {
        const bankAccountsResult = await this.repository.findManyByIdUserWithoutPassword(args.userId)

        if (!bankAccountsResult.isSuccess()) {
            if (bankAccountsResult.isErrorInOperation()) {
                return Result.failure({ title: 'Query Bank Accounts', message: 'Unable to query bank accounts' })
            }

            return Result.failure({ title: 'Query Bank Accounts', message: 'Bank accounts not found' })
        }

        return Result.success(bankAccountsResult.getStatus())
    }
}
