import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { ID } from '@@types'
import { BankAccountRepository } from '@modules/bank-account/bank-account.repository'

@Service({ name: 'bank-account.use-case.query' })
export class BankAccountQueryUseCase {
    constructor(@Injection.Inject('bank-account.repository') private repository: BankAccountRepository) {}

    async queryByIdWithoutPassword(args: { id: ID }) {
        const bankAccountResult = await this.repository.findByIdWithoutPasswordMaster(args.id)

        return bankAccountResult
    }

    async queryManyByIdUserWithoutPassword(args: { userId: ID }) {
        const bankAccountsResult = await this.repository.findManyByIdUserWithoutPasswordMaster(args.userId)

        return bankAccountsResult
    }
}
