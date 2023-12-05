import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { ID } from '@@types'
import { AccountRepository } from '@modules/account/account.repository'

@Service({ name: 'account.use-case.query' })
export class AccountQueryUseCase {
    constructor(@Injection.Inject('account.repository') private repository: AccountRepository) {}

    async queryByIdWithoutPassword({ id }: { id: ID }) {
        const account = await this.repository.findByIdWithoutPassword(id)

        return Result.success(account)
    }

    async queryManyWithoutPassword() {
        const account = await this.repository.findManyWithoutPassword()

        return Result.success(account)
    }
}
