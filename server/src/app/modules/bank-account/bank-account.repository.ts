import { Service } from '@esliph/module'
import { ID } from '@@types'
import { Repository } from '@services/repository.service'
import { BankAccountModel } from '@modules/bank-account/bank-account.model'

@Service({ name: 'bank-account.repository' })
export class BankAccountRepository extends Repository {
    private static GLOBAL_MESSAGE = {
        create: {
            title: 'Register Bank Account',
            success: 'Bank account successfully registered',
            failed: 'Failed to register bank account'
        },
        update: {
            title: 'Update Bank Account',
            success: 'Bank account successfully updated',
            failed: 'Failed to update bank account data'
        },
        find: {
            title: 'Find Bank Account',
            notFound: 'Bank account not found',
            failed: 'Unable to query bank account'
        },
        findMany: {
            title: 'Find Bank Accounts',
            failed: 'Unable to query bank accounts'
        }
    }

    async register({ balance, name, password, userId, code }: BankAccountModel.Model) {
        try {
            await this.repo.create({ data: { balance, name, password, userId, code } })

            return this.handleResponse<{ message: string }>({ message: BankAccountRepository.GLOBAL_MESSAGE.create.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, { error: { title: BankAccountRepository.GLOBAL_MESSAGE.create.title, message: BankAccountRepository.GLOBAL_MESSAGE.create.failed } })
        }
    }

    async updateById(args: Partial<Omit<BankAccountModel.BankAccount, 'userId'>>, where: { id: ID }) {
        try {
            await this.repo.update({ where: { id: where.id }, data: args })

            return this.handleResponse<{ message: string }>({ message: BankAccountRepository.GLOBAL_MESSAGE.update.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, { error: { title: BankAccountRepository.GLOBAL_MESSAGE.update.title, message: BankAccountRepository.GLOBAL_MESSAGE.update.failed } })
        }
    }

    async findById(id: ID) {
        try {
            const bankAccount = await this.repo.findFirst({ where: { id } })

            return this.handleResponse<BankAccountModel.BankAccount>(bankAccount, {
                noAcceptNullable: true,
                error: { title: BankAccountRepository.GLOBAL_MESSAGE.find.title, message: BankAccountRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<BankAccountModel.BankAccount>(err, { error: { title: BankAccountRepository.GLOBAL_MESSAGE.find.title, message: BankAccountRepository.GLOBAL_MESSAGE.find.failed } })
        }
    }

    async findByIdWithFinancialTransactionsAndPayments(id: ID) {
        try {
            const bankAccount = await this.repo.findFirst({ where: { id }, include: { financialTransactions: { include: { payments: true } } } })

            return this.handleResponse<BankAccountModel.BankAccountWithFinancialTransactionsAndPayments>(bankAccount, {
                noAcceptNullable: true,
                error: { title: BankAccountRepository.GLOBAL_MESSAGE.find.title, message: BankAccountRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<BankAccountModel.BankAccountWithFinancialTransactionsAndPayments>(err, {
                error: { title: BankAccountRepository.GLOBAL_MESSAGE.find.title, message: BankAccountRepository.GLOBAL_MESSAGE.find.failed },
            })
        }
    }

    async findByIdAndBetweenDateCompetenceWithFinancialTransactionsAndPayments(id: ID, dateStart: Date, dateEnd: Date) {
        try {
            const bankAccount = await this.repo.findFirst({
                where: { id },
                include: {
                    financialTransactions: {
                        where: {
                            dateTimeCompetence: {
                                gte: dateStart,
                                lte: dateEnd,
                            },
                        },
                        include: { payments: true },
                    },
                },
            })

            return this.handleResponse<BankAccountModel.BankAccountWithFinancialTransactionsAndPayments>(bankAccount, {
                noAcceptNullable: true,
                error: { title: BankAccountRepository.GLOBAL_MESSAGE.find.title, message: BankAccountRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<BankAccountModel.BankAccountWithFinancialTransactionsAndPayments>(err, {
                error: { title: BankAccountRepository.GLOBAL_MESSAGE.find.title, message: BankAccountRepository.GLOBAL_MESSAGE.find.failed },
            })
        }
    }

    async findByIdWithoutPassword(id: ID) {
        try {
            const bankAccount = await this.repo.findFirst({
                where: { id },
                select: BankAccountModel.BankAccountWithoutPasswordSelect,
            })

            return this.handleResponse<BankAccountModel.BankAccountWithoutPassword>(bankAccount, {
                noAcceptNullable: true,
                error: { title: BankAccountRepository.GLOBAL_MESSAGE.find.title, message: BankAccountRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<BankAccountModel.BankAccountWithoutPassword>(err, {
                error: { title: BankAccountRepository.GLOBAL_MESSAGE.find.title, message: BankAccountRepository.GLOBAL_MESSAGE.find.failed },
            })
        }
    }

    async findByCode(code: string) {
        try {
            const bankAccount = await this.repo.findFirst({ where: { code } })

            return this.handleResponse<BankAccountModel.BankAccount>(bankAccount, {
                noAcceptNullable: true,
                error: { title: BankAccountRepository.GLOBAL_MESSAGE.find.title, message: BankAccountRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<BankAccountModel.BankAccount>(err, { error: { title: BankAccountRepository.GLOBAL_MESSAGE.find.title, message: BankAccountRepository.GLOBAL_MESSAGE.find.failed } })
        }
    }

    async findByCodeWithoutPassword(code: string) {
        try {
            const bankAccount = await this.repo.findFirst({
                where: { code },
                select: BankAccountModel.BankAccountWithoutPasswordSelect,
            })

            return this.handleResponse<BankAccountModel.BankAccountWithoutPassword>(bankAccount, {
                noAcceptNullable: true,
                error: { title: BankAccountRepository.GLOBAL_MESSAGE.find.title, message: BankAccountRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<BankAccountModel.BankAccountWithoutPassword>(err, {
                error: { title: BankAccountRepository.GLOBAL_MESSAGE.find.title, message: BankAccountRepository.GLOBAL_MESSAGE.find.failed },
            })
        }
    }

    async findByCodeAndIdUser(code: string, userId: ID) {
        try {
            const bankAccount = await this.repo.findFirst({ where: { code, userId } })

            return this.handleResponse<BankAccountModel.BankAccount>(bankAccount, {
                noAcceptNullable: true,
                error: { title: BankAccountRepository.GLOBAL_MESSAGE.find.title, message: BankAccountRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<BankAccountModel.BankAccount>(err, { error: { title: BankAccountRepository.GLOBAL_MESSAGE.find.title, message: BankAccountRepository.GLOBAL_MESSAGE.find.failed } })
        }
    }

    async findByCodeAndIdUserWithoutPassword(code: string, userId: ID) {
        try {
            const bankAccount = await this.repo.findFirst({
                where: { code, userId },
                select: BankAccountModel.BankAccountWithoutPasswordSelect,
            })

            return this.handleResponse<BankAccountModel.BankAccountWithoutPassword>(bankAccount, {
                noAcceptNullable: true,
                error: { title: BankAccountRepository.GLOBAL_MESSAGE.find.title, message: BankAccountRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<BankAccountModel.BankAccountWithoutPassword>(err, {
                error: { title: BankAccountRepository.GLOBAL_MESSAGE.find.title, message: BankAccountRepository.GLOBAL_MESSAGE.find.failed },
            })
        }
    }

    async findManyByUserId(userId: ID) {
        try {
            const users = await this.repo.findMany({
                where: { userId },
                orderBy: { updatedAt: 'desc' },
            })

            return this.handleResponse<BankAccountModel.BankAccount[]>(users)
        } catch (err: any) {
            return this.handleError<BankAccountModel.BankAccount[]>(err, { error: { title: BankAccountRepository.GLOBAL_MESSAGE.findMany.title, message: BankAccountRepository.GLOBAL_MESSAGE.findMany.failed } })
        }
    }

    async findManyByUserIdWithoutPassword(userId: ID) {
        try {
            const bankAccounts = await this.repo.findMany({
                where: { userId },
                select: BankAccountModel.BankAccountWithoutPasswordSelect,
                orderBy: { updatedAt: 'desc' },
            })

            return this.handleResponse<BankAccountModel.BankAccountWithoutPassword[]>(bankAccounts)
        } catch (err: any) {
            return this.handleError<BankAccountModel.BankAccountWithoutPassword[]>(err, {
                error: { title: BankAccountRepository.GLOBAL_MESSAGE.findMany.title, message: BankAccountRepository.GLOBAL_MESSAGE.findMany.failed },
            })
        }
    }

    async findManyByUserIdWithoutPasswordAndBalance(userId: ID) {
        try {
            const bankAccounts = await this.repo.findMany({
                where: { userId },
                select: BankAccountModel.BankAccountWithoutPasswordSelectAndBalance,
                orderBy: { updatedAt: 'desc' },
            })

            return this.handleResponse<BankAccountModel.BankAccountWithoutPasswordAndBalance[]>(bankAccounts)
        } catch (err: any) {
            return this.handleError<BankAccountModel.BankAccountWithoutPassword[]>(err, {
                error: { title: BankAccountRepository.GLOBAL_MESSAGE.findMany.title, message: BankAccountRepository.GLOBAL_MESSAGE.findMany.failed },
            })
        }
    }

    private get repo() {
        return this.database.instance.bankAccount
    }
}
