import { Service } from '@esliph/module'
import { Result } from '@esliph/common'
import { ID } from '@@types'
import { Repository } from '@common/repository'
import { BankAccountModel } from '@modules/bank-account/bank-account.model'

@Service({ name: 'bank-account.repository' })
export class BankAccountRepository extends Repository {

    async register({ balance, name, passwordMaster, userId }: BankAccountModel.Model) {
        try {
            await this.repo.create({ data: { balance, name, passwordMaster, userId } })

            return this.performResponse(Result.success({ ok: true }))
        } catch (err: any) {
            return this.performError(err, { error: { title: 'Register Bank Account', message: 'Cannot register bank account' } })
        }
    }

    async updateById(args: Partial<Omit<BankAccountModel.Model, 'userId'>>, where: { id: ID }) {
        try {
            await this.repo.update({ where: { id: where.id }, data: args })

            return this.performResponse(Result.success({ ok: true }))
        } catch (err: any) {
            return this.performError(err, { error: { title: 'Update Bank Account', message: 'Cannot update bank account' } })
        }
    }

    async findById(id: ID) {
        try {
            const bankAccount = await this.repo.findFirst({ where: { id } })

            if (!bankAccount) {
                return this.performResponse(Result.failure<BankAccountModel.Model>({ title: 'Find Bank Account', message: 'Bank account not found' }))
            }

            return this.performResponse(Result.success<BankAccountModel.Model>(bankAccount))
        } catch (err: any) {
            return this.performError(err, { noThrow: true, error: { title: 'Find Bank Account', message: 'Bank account not found' } })
        }
    }

    async findByIdWithoutPasswordMaster(id: ID) {
        try {
            const bankAccount = await this.repo.findFirst({ where: { id }, select: BankAccountModel.BankAccountWithoutPasswordMasterSelect })

            if (!bankAccount) {
                return this.performResponse(Result.failure<BankAccountModel.BankAccountWithoutPasswordMaster>({ title: 'Find Bank Account', message: 'Bank account not found' }))
            }

            return this.performResponse(Result.success<BankAccountModel.BankAccountWithoutPasswordMaster>(bankAccount))
        } catch (err: any) {
            return this.performError(err, { noThrow: true, error: { title: 'Find Bank Account', message: 'Bank account not found' } })
        }
    }

    async findManyByIdUser(userId: ID) {
        try {
            const users = await this.repo.findMany({ where: { userId } })

            return this.performResponse(Result.success<BankAccountModel.Model[]>(users))
        } catch (err: any) {
            return this.performError(err, { noThrow: true, error: { title: 'Find Bank Account', message: 'Bank account not found' } })
        }
    }

    async findManyByIdUserWithoutPasswordMaster(userId: ID) {
        try {
            const bankAccounts = await this.repo.findMany({ where: { userId }, select: BankAccountModel.BankAccountWithoutPasswordMasterSelect })

            return this.performResponse(Result.success<BankAccountModel.BankAccountWithoutPasswordMaster[]>(bankAccounts))
        } catch (err: any) {
            return this.performError(err, { noThrow: true, error: { title: 'Find Bank Account', message: 'Bank account not found' } })
        }
    }

    private get repo() {
        return this.database.instance.bankAccount
    }
}
