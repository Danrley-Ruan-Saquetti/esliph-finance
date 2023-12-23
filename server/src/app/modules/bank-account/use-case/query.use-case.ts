import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { Result } from '@esliph/common'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { ValidatorService } from '@services/validator.service'
import { BankAccountRepository } from '@modules/bank-account/bank-account.repository'

const schemaNumber = ValidatorService.schema.coerce.number()

@Service({ name: 'bank-account.use-case.query' })
export class BankAccountQueryUseCase extends UseCase {
    constructor(@Injection.Inject('bank-account.repository') private repository: BankAccountRepository) { super() }

    async queryByIdWithoutPassword(args: { id: ID }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const bankAccountResult = await this.repository.findByIdWithoutPassword(id)

        if (!bankAccountResult.isSuccess()) {
            if (bankAccountResult.isErrorInOperation()) {
                return Result.failure({ title: 'Query Bank Account', message: 'Unable to query bank account' })
            }

            return Result.failure({ title: 'Query Bank Account', message: 'Bank account not found' })
        }

        return Result.success(bankAccountResult.getValue())
    }

    async queryByCodeWithoutPassword(args: { code: string }) {
        const bankAccountResult = await this.repository.findByCodeWithoutPassword(args.code)

        if (!bankAccountResult.isSuccess()) {
            if (bankAccountResult.isErrorInOperation()) {
                return Result.failure({ title: 'Query Bank Account', message: 'Unable to query bank account' })
            }

            return Result.failure({ title: 'Query Bank Account', message: 'Bank account not found' })
        }

        return Result.success(bankAccountResult.getValue())
    }

    async queryByCodeWithoutPasswordWithMask(args: { code: string }) {
        const bankAccountResult = await this.repository.findByCodeWithoutPassword(args.code)

        if (!bankAccountResult.isSuccess()) {
            if (bankAccountResult.isErrorInOperation()) {
                return Result.failure({ title: 'Query Bank Account', message: 'Unable to query bank account' })
            }

            return Result.failure({ title: 'Query Bank Account', message: 'Bank account not found' })
        }

        return Result.success(bankAccountResult.getValue())
    }

    async queryManyByIdUserWithoutPassword(args: { userId: ID }) {
        const userId = this.validateDTO(args.userId, schemaNumber)

        const bankAccountsResult = await this.repository.findManyByIdUserWithoutPassword(userId)

        if (!bankAccountsResult.isSuccess()) {
            if (bankAccountsResult.isErrorInOperation()) {
                return Result.failure({ title: 'Query Bank Accounts', message: 'Unable to query bank accounts' })
            }

            return Result.failure({ title: 'Query Bank Accounts', message: 'Bank accounts not found' })
        }

        return Result.success(bankAccountsResult.getValue())
    }
}
