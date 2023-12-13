import { Service } from '@esliph/module'
import { Result } from '@esliph/common'
import { ID } from '@@types'
import { Repository } from '@services/repository.service'
import { BankAccountModel } from '@modules/bank-account/bank-account.model'

@Service({ name: 'bank-account.repository' })
export class BankAccountRepository extends Repository {
    async register({ balance, name, passwordMaster, userId }: BankAccountModel.Model) {
        try {
            await this.repo.create({ data: { balance, name, passwordMaster, userId } })

            return this.handleResponse<{ ok: boolean }>({ ok: true }, { error: { title: 'Register Bank Account', message: 'Failed to register bank account' } })
        } catch (err: any) {
            return this.handleError<{ ok: boolean }>(err, { error: { title: 'Register Bank Account', message: 'Unable to register bank account' } })
        }
    }

    async updateById(args: Partial<Omit<BankAccountModel.Model, 'userId'>>, where: { id: ID }) {
        try {
            await this.repo.update({ where: { id: where.id }, data: args })

            return this.handleResponse<{ ok: boolean }>({ ok: true }, { noAcceptNullable: true, error: { title: 'Update Bank Account', message: 'Fa' } })
        } catch (err: any) {
            return this.handleError<{ ok: boolean }>(err, { error: { title: 'Update Bank Account', message: 'Unable to update bank account' } })
        }
    }

    async findById(id: ID) {
        try {
            const bankAccount = await this.repo.findFirst({ where: { id } })

            return this.handleResponse<BankAccountModel.Model>(bankAccount, { noAcceptNullable: true, error: { title: 'Find Bank Account', message: 'Bank account not found' } })
        } catch (err: any) {
            return this.handleError<BankAccountModel.Model>(err, { error: { title: 'Find Bank Account', message: 'Bank account not found' } })
        }
    }

    async findByIdWithoutPasswordMaster(id: ID) {
        try {
            const bankAccount = await this.repo.findFirst({ where: { id }, select: BankAccountModel.BankAccountWithoutPasswordMasterSelect })

            return this.handleResponse<BankAccountModel.BankAccountWithoutPasswordMaster>(bankAccount, { noAcceptNullable: true, error: { title: 'Find Bank Account', message: 'Bank account not found' } })
        } catch (err: any) {
            return this.handleError<BankAccountModel.BankAccountWithoutPasswordMaster>(err, {
                error: { title: 'Find Bank Account', message: 'Unable to find bank account' },
            })
        }
    }

    async findManyByIdUser(userId: ID) {
        try {
            const users = await this.repo.findMany({ where: { userId } })

            return this.handleResponse<BankAccountModel.Model[]>(users, { error: { title: 'Find Bank Account', message: 'Bank account not found' } })
        } catch (err: any) {
            return this.handleError<BankAccountModel.Model[]>(err, { error: { title: 'Find Bank Account', message: 'Unable to find bank account' } })
        }
    }

    async findManyByIdUserWithoutPasswordMaster(userId: ID) {
        try {
            const bankAccounts = await this.repo.findMany({ where: { userId }, select: BankAccountModel.BankAccountWithoutPasswordMasterSelect })

            return this.handleResponse<BankAccountModel.BankAccountWithoutPasswordMaster[]>(bankAccounts, { error: { title: 'Find Bank Account', message: 'Bank account not found' }, })
        } catch (err: any) {
            return this.handleError<BankAccountModel.BankAccountWithoutPasswordMaster[]>(err, {
                error: { title: 'Find Bank Account', message: 'Unable to find bank account' },
            })
        }
    }

    private get repo() {
        return this.database.instance.bankAccount
    }
}
