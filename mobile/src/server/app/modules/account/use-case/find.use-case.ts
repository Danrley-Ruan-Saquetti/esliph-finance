import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { DatabaseService } from '@server/services/database.service'
import { ValidatorService } from '@server/services/validator.service'
import { Account } from '@modules/account/account.model'

@Service({ name: 'account.use-case.create' })
export class AccountCreateUseCase {
    constructor(
        @Injection.Inject('database') private database: DatabaseService,
        @Injection.Inject('validator') private validator: ValidatorService,
    ) {}

    async findById(id: number) {
        const accountResult = await this.database.queryOne<Account>('SELECT * FROM account WHERE id = ?', [id])

        return Result.success(accountResult.getValue())
    }

    async findByName(name: string) {}

    async findByEmail(email: string) {}

    async findByIdWithoutPassword(id: number) {}

    async findByNameWithoutPassword(name: string) {}

    async findByEmailWithoutPassword(email: string) {}

    async findMany() {}

    async findManyWithoutPassword() {}
}
