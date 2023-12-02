import { AccountRepository } from '@modules/account/account.repository'
import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'

@Service({ name: 'account.use-case.query' })
export class AccountQueryUseCase {
    constructor(@Injection.Inject('account.repository') private repository: AccountRepository) { }


}
