import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { ID } from '@@types'
import { BankAccountRepository } from '@modules/bank-account/bank-account.repository'

@Service({ name: 'bank-account.use-case.query' })
export class BankAccountQueryUseCase {
    constructor(@Injection.Inject('bank-account.repository') private repository: BankAccountRepository) {}

    async queryByIdWithoutPassword({ id }: { id: ID }) {
        const account = await this.repository.findByIdWithoutPassword(id)

        return Result.success(account)
    }

    async queryManyWithoutPassword() {
        const account = await this.repository.findManyWithoutPassword()

        return Result.success(account)
    }
}
