import { Prisma } from '@prisma/client'
import { Service } from '@core'
import { ID } from '@@types'
import { Repository } from '@services/repository.service'
import { BankAccountModel } from '@modules/bank-account/bank-account.model'

type BankAccountGetPayloadTypes = boolean | null | undefined | { select?: Prisma.BankAccountSelect | null }
type BankAccountGetPayload<T extends boolean | null | undefined | { select?: Prisma.BankAccountSelect | null }> = Prisma.BankAccountGetPayload<T>
type BankAccountPropSelect<ArgsSelect extends BankAccountGetPayloadTypes> = BankAccountGetPayload<ArgsSelect>
type BankAccountFindResponse<ArgsSelect extends BankAccountGetPayloadTypes> = BankAccountPropSelect<ArgsSelect>

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

    async create(args: { data: Prisma.BankAccountCreateInput }) {
        try {
            await this.database.instance.bankAccount.create({ ...args })

            return this.handleResponse<{ message: string }>({ message: BankAccountRepository.GLOBAL_MESSAGE.create.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: BankAccountRepository.GLOBAL_MESSAGE.create.title, message: BankAccountRepository.GLOBAL_MESSAGE.create.failed }
            })
        }
    }

    async update(args: { where: Prisma.BankAccountWhereUniqueInput, data: Prisma.BankAccountUpdateInput }) {
        try {
            await this.database.instance.bankAccount.update({ ...args })

            return this.handleResponse<{ message: string }>({ message: BankAccountRepository.GLOBAL_MESSAGE.update.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: BankAccountRepository.GLOBAL_MESSAGE.update.title, message: BankAccountRepository.GLOBAL_MESSAGE.update.failed }
            })
        }
    }

    async findFirst<Args extends Prisma.BankAccountFindFirstArgs>(args: Args) {
        try {
            const bankAccount = await this.database.instance.bankAccount.findFirst(args) as BankAccountFindResponse<Args>

            return this.handleResponse<BankAccountFindResponse<Args>>(bankAccount, {
                noAcceptNullable: true,
                error: { title: BankAccountRepository.GLOBAL_MESSAGE.find.title, message: BankAccountRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<BankAccountFindResponse<Args>>(err, {
                error: { title: BankAccountRepository.GLOBAL_MESSAGE.find.title, message: BankAccountRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findUnique<Args extends Prisma.BankAccountFindUniqueArgs>(args: Args) {
        try {
            const bankAccount = await this.database.instance.bankAccount.findUnique(args) as BankAccountFindResponse<Args>

            return this.handleResponse<BankAccountFindResponse<Args>>(bankAccount, {
                noAcceptNullable: true,
                error: { title: BankAccountRepository.GLOBAL_MESSAGE.find.title, message: BankAccountRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<BankAccountFindResponse<Args>>(err, {
                error: { title: BankAccountRepository.GLOBAL_MESSAGE.find.title, message: BankAccountRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findMany<Args extends Prisma.BankAccountFindManyArgs>(args: Args) {
        try {
            const bankAccount = await this.database.instance.bankAccount.findMany(args) as BankAccountFindResponse<Args>[]

            return this.handleResponse<BankAccountFindResponse<Args>[]>(bankAccount, {
                noAcceptNullable: true,
                error: { title: BankAccountRepository.GLOBAL_MESSAGE.find.title, message: BankAccountRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<BankAccountFindResponse<Args>[]>(err, {
                error: { title: BankAccountRepository.GLOBAL_MESSAGE.find.title, message: BankAccountRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }
}
