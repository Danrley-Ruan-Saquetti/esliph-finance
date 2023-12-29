import { Service } from '@esliph/module'
import { ID } from '@@types'
import { Repository } from '@services/repository.service'
import { BankAccountModel } from '@modules/bank-account/bank-account.model'

@Service({ name: 'bank-account.repository' })
export class BankAccountRepository extends Repository {
    async register({ balance, name, password, userId, code }: BankAccountModel.Model) {
        try {
            await this.repo.create({ data: { balance, name, password, userId, code } })

            return this.handleResponse<{ message: string }>(
                { message: 'Bank account successfully registered' },
                { error: { title: 'Register Bank Account', message: 'Failed to register bank account' } },
            )
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, { error: { title: 'Register Bank Account', message: 'Unable to register bank account' } })
        }
    }

    async updateById(args: Partial<Omit<BankAccountModel.BankAccount, 'userId'>>, where: { id: ID }) {
        try {
            await this.repo.update({ where: { id: where.id }, data: args })

            return this.handleResponse<{ message: string }>(
                { message: 'Bank account successfully updated' },
                { noAcceptNullable: true, error: { title: 'Update Bank Account', message: 'Failed to updated bank account' } },
            )
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, { error: { title: 'Update Bank Account', message: 'Unable to update bank account' } })
        }
    }

    async findById(id: ID) {
        try {
            const bankAccount = await this.repo.findFirst({ where: { id } })

            return this.handleResponse<BankAccountModel.BankAccount>(bankAccount, {
                noAcceptNullable: true,
                error: { title: 'Find Bank Account', message: 'Bank account not found' },
            })
        } catch (err: any) {
            return this.handleError<BankAccountModel.BankAccount>(err, { error: { title: 'Find Bank Account', message: 'Bank account not found' } })
        }
    }

    async findByIdWithoutPassword(id: ID) {
        try {
            const bankAccount = await this.repo.findFirst({
                where: { id },
                select: BankAccountModel.BankAccountWithoutPasswordSelect
            })

            return this.handleResponse<BankAccountModel.BankAccountWithoutPassword>(bankAccount, {
                noAcceptNullable: true,
                error: { title: 'Find Bank Account', message: 'Bank account not found' },
            })
        } catch (err: any) {
            return this.handleError<BankAccountModel.BankAccountWithoutPassword>(err, {
                error: { title: 'Find Bank Account', message: 'Unable to find bank account' },
            })
        }
    }

    async findByCode(code: string) {
        try {
            const bankAccount = await this.repo.findFirst({ where: { code } })

            return this.handleResponse<BankAccountModel.BankAccount>(bankAccount, {
                noAcceptNullable: true,
                error: { title: 'Find Bank Account', message: 'Bank account not found' },
            })
        } catch (err: any) {
            return this.handleError<BankAccountModel.BankAccount>(err, { error: { title: 'Find Bank Account', message: 'Bank account not found' } })
        }
    }

    async findByCodeWithoutPassword(code: string) {
        try {
            const bankAccount = await this.repo.findFirst({
                where: { code },
                select: BankAccountModel.BankAccountWithoutPasswordSelect
            })

            return this.handleResponse<BankAccountModel.BankAccountWithoutPassword>(bankAccount, {
                noAcceptNullable: true,
                error: { title: 'Find Bank Account', message: 'Bank account not found' },
            })
        } catch (err: any) {
            return this.handleError<BankAccountModel.BankAccountWithoutPassword>(err, {
                error: { title: 'Find Bank Account', message: 'Unable to find bank account' },
            })
        }
    }

    async findByCodeAndIdUser(code: string, userId: ID) {
        try {
            const bankAccount = await this.repo.findFirst({ where: { code, userId } })

            return this.handleResponse<BankAccountModel.BankAccount>(bankAccount, {
                noAcceptNullable: true,
                error: { title: 'Find Bank Account', message: 'Bank account not found' },
            })
        } catch (err: any) {
            return this.handleError<BankAccountModel.BankAccount>(err, { error: { title: 'Find Bank Account', message: 'Bank account not found' } })
        }
    }

    async findByCodeAndIdUserWithoutPassword(code: string, userId: ID) {
        try {
            const bankAccount = await this.repo.findFirst({
                where: { code, userId },
                select: BankAccountModel.BankAccountWithoutPasswordSelect
            })

            return this.handleResponse<BankAccountModel.BankAccountWithoutPassword>(bankAccount, {
                noAcceptNullable: true,
                error: { title: 'Find Bank Account', message: 'Bank account not found' },
            })
        } catch (err: any) {
            return this.handleError<BankAccountModel.BankAccountWithoutPassword>(err, {
                error: { title: 'Find Bank Account', message: 'Unable to find bank account' },
            })
        }
    }

    async findManyByUserId(userId: ID) {
        try {
            const users = await this.repo.findMany({
                where: { userId },
                orderBy: { updatedAt: 'desc' }
            })

            return this.handleResponse<BankAccountModel.BankAccount[]>(users, { error: { title: 'Find Bank Account', message: 'Bank account not found' } })
        } catch (err: any) {
            return this.handleError<BankAccountModel.BankAccount[]>(err, { error: { title: 'Find Bank Account', message: 'Unable to find bank account' } })
        }
    }

    async findManyByUserIdWithoutPassword(userId: ID) {
        try {
            const bankAccounts = await this.repo.findMany({
                where: { userId },
                select: BankAccountModel.BankAccountWithoutPasswordSelect,
                orderBy: { updatedAt: 'desc' }
            })

            return this.handleResponse<BankAccountModel.BankAccountWithoutPassword[]>(bankAccounts, {
                error: { title: 'Find Bank Account', message: 'Bank account not found' },
            })
        } catch (err: any) {
            return this.handleError<BankAccountModel.BankAccountWithoutPassword[]>(err, {
                error: { title: 'Find Bank Account', message: 'Unable to find bank account' },
            })
        }
    }

    async findManyByUserIdWithoutPasswordAndBalance(userId: ID) {
        try {
            const bankAccounts = await this.repo.findMany({
                where: { userId },
                select: BankAccountModel.BankAccountWithoutPasswordSelectAndBalance,
                orderBy: { updatedAt: 'desc' }
            })

            return this.handleResponse<BankAccountModel.BankAccountWithoutPasswordAndBalance[]>(bankAccounts, {
                error: { title: 'Find Bank Account', message: 'Bank account not found' },
            })
        } catch (err: any) {
            return this.handleError<BankAccountModel.BankAccountWithoutPassword[]>(err, {
                error: { title: 'Find Bank Account', message: 'Unable to find bank account' },
            })
        }
    }

    private get repo() {
        return this.database.instance.bankAccount
    }
}
