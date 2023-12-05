import { Service } from '@esliph/module'
import { Injection } from '@esliph/injection'
import { ID } from '@@types'
import { DatabaseService, RepositoryQuery } from '@services/database.service'
import { BankAccountModel } from './bank-account.model'

@Service({ name: 'bank-account.repository' })
export class BankAccountRepository {
    constructor(@Injection.Inject('database') private database: DatabaseService) {}

    @RepositoryQuery({ error: { title: 'Register User', message: 'Cannot register user' } })
    async register({ balance, name, passwordMaster, userId }: BankAccountModel.Model) {
        await this.database.user.create({ data: { balance, name, passwordMaster, userId } })

        return Result.success({ ok: true })
    }
}
