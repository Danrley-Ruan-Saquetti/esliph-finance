import { Service } from '@esliph/module'
import { Injection } from '@esliph/injection'
import { ID } from '@@types'
import { DatabaseService, RepositoryQuery } from '@services/database.service'
import { BankAccountModel } from './bank-account.model'
import { Result } from '@esliph/common'

@Service({ name: 'bank-account.repository' })
export class BankAccountRepository {
    constructor(@Injection.Inject('database') private database: DatabaseService) {}

    @RepositoryQuery({ error: { title: 'Register Bank Account', message: 'Cannot register bank account' } })
    async register({ balance, name, passwordMaster, userId }: BankAccountModel.Model) {
        await this.database.bankAccount.create({ data: { balance, name, passwordMaster, userId } })

        return Result.success({ ok: true })
    }

    @RepositoryQuery({ error: { title: 'Update Bank Account', message: 'Cannot update bank account' } })
    async updateById(args: Partial<Omit<BankAccountModel.Model, 'userId'>>, where: { id: ID }) {
        await this.database.bankAccount.update({ where: { id: where.id }, data: args })

        return Result.success({ ok: true })
    }

    @RepositoryQuery({ noThrow: true, error: { title: 'Find Bank Account', message: 'Bank account not found' } })
    async findById(id: ID) {
        const bankAccount = await this.database.bankAccount.findFirst({ where: { id } })

        if (!bankAccount) {
            return Result.failure<BankAccountModel.Model>({ title: 'Find Bank Account', message: 'Bank account not found' })
        }

        return Result.success<BankAccountModel.Model>(bankAccount)
    }

    @RepositoryQuery({ noThrow: true, error: { title: 'Find Bank Account', message: 'Bank account not found' } })
    async findByIdWithoutPasswordMaster(id: ID) {
        const bankAccount = await this.database.bankAccount.findFirst({ where: { id }, select: BankAccountModel.BankAccountWithoutPasswordMasterSelect })

        if (!bankAccount) {
            return Result.failure<BankAccountModel.BankAccountWithoutPasswordMaster>({ title: 'Find Bank Account', message: 'Bank account not found' })
        }

        return Result.success<BankAccountModel.BankAccountWithoutPasswordMaster>(bankAccount)
    }

    @RepositoryQuery({ noThrow: true, error: { title: 'Find Bank Account', message: 'Bank account not found' } })
    async findManyByIdUser(userId: ID) {
        const users = await this.database.bankAccount.findMany({ where: { userId } })

        return Result.success<BankAccountModel.Model[]>(users)
    }

    @RepositoryQuery({ noThrow: true, error: { title: 'Find Bank Account', message: 'Bank account not found' } })
    async findManyByIdUserWithoutPasswordMaster(userId: ID) {
        const bankAccounts = await this.database.bankAccount.findMany({ where: { userId }, select: BankAccountModel.BankAccountWithoutPasswordMasterSelect })

        return Result.success<BankAccountModel.BankAccountWithoutPasswordMaster[]>(bankAccounts)
    }
}
