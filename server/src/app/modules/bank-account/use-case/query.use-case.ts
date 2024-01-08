import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { Result } from '@esliph/common'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { ValidatorService } from '@services/validator.service'
import { GLOBAL_BANK_ACCOUNT_DTO } from '@modules/bank-account/bank-account.global'
import { BankAccountModel } from '@modules/bank-account/bank-account.model'
import { BankAccountRepository } from '@modules/bank-account/bank-account.repository'

const schemaNumber = ValidatorService.schema.coerce.number()

@Service({ name: 'bank-account.use-case.query' })
export class BankAccountQueryUseCase extends UseCase {
    private static MASK_PROPS = {
        code: GLOBAL_BANK_ACCOUNT_DTO.code.maskData,
        balance: GLOBAL_BANK_ACCOUNT_DTO.balance.maskData,
    }

    constructor(@Injection.Inject('bank-account.repository') private bankAccountRepository: BankAccountRepository) {
        super()
    }

    async queryByIdWithoutPassword(args: { id: ID }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const bankAccountResult = await this.bankAccountRepository.findByIdWithoutPassword(id)

        if (!bankAccountResult.isSuccess()) {
            if (bankAccountResult.isErrorInOperation()) {
                return Result.failure<BankAccountModel.BankAccountWithoutPassword>({ title: 'Query Bank Account', message: 'Unable to query bank account' })
            }

            return Result.failure<BankAccountModel.BankAccountWithoutPassword>({ title: 'Query Bank Account', message: 'Bank account not found' })
        }

        return Result.success<BankAccountModel.BankAccountWithoutPassword>(bankAccountResult.getValue())
    }

    async queryByIdCodeMaskWithoutPassword(args: { id: ID }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const bankAccountResult = await this.bankAccountRepository.findByIdWithoutPassword(id)

        if (!bankAccountResult.isSuccess()) {
            if (bankAccountResult.isErrorInOperation()) {
                return Result.failure<BankAccountModel.BankAccountWithoutPassword>({ title: 'Query Bank Account', message: 'Unable to query bank account' })
            }

            return Result.failure<BankAccountModel.BankAccountWithoutPassword>({ title: 'Query Bank Account', message: 'Bank account not found' })
        }

        return Result.success<BankAccountModel.BankAccountWithoutPassword>(
            this.maskProp(bankAccountResult.getValue(), { prop: 'code', mask: BankAccountQueryUseCase.MASK_PROPS.code }),
        )
    }

    async queryByIdCodeMaskWithoutPasswordWhitMask(args: { id: ID }, options: { masks?: (keyof BankAccountModel.BankAccountWithoutPassword)[] } = {}) {
        const id = this.validateDTO(args.id, schemaNumber)

        const bankAccountResult = await this.bankAccountRepository.findByIdWithoutPassword(id)

        if (!bankAccountResult.isSuccess()) {
            if (bankAccountResult.isErrorInOperation()) {
                return Result.failure<BankAccountModel.BankAccountWithoutPassword>({ title: 'Query Bank Account', message: 'Unable to query bank account' })
            }

            return Result.failure<BankAccountModel.BankAccountWithoutPassword>({ title: 'Query Bank Account', message: 'Bank account not found' })
        }

        return Result.success<BankAccountModel.BankAccountWithoutPassword>(
            this.maskProp(bankAccountResult.getValue(), { prop: 'code', mask: BankAccountQueryUseCase.MASK_PROPS.code }),
        )
    }

    async queryByCodeWithoutPassword(args: { code: string }) {
        const bankAccountResult = await this.bankAccountRepository.findByCodeWithoutPassword(args.code)

        if (!bankAccountResult.isSuccess()) {
            if (bankAccountResult.isErrorInOperation()) {
                return Result.failure<BankAccountModel.BankAccountWithoutPassword>({ title: 'Query Bank Account', message: 'Unable to query bank account' })
            }

            return Result.failure<BankAccountModel.BankAccountWithoutPassword>({ title: 'Query Bank Account', message: 'Bank account not found' })
        }

        return Result.success<BankAccountModel.BankAccountWithoutPassword>(bankAccountResult.getValue())
    }

    async queryByCodeWithoutPasswordWithMask(args: { code: string }) {
        const bankAccountResult = await this.bankAccountRepository.findByCodeWithoutPassword(args.code)

        if (!bankAccountResult.isSuccess()) {
            if (bankAccountResult.isErrorInOperation()) {
                return Result.failure<BankAccountModel.BankAccountWithoutPassword>({ title: 'Query Bank Account', message: 'Unable to query bank account' })
            }

            return Result.failure<BankAccountModel.BankAccountWithoutPassword>({ title: 'Query Bank Account', message: 'Bank account not found' })
        }

        return Result.success<BankAccountModel.BankAccountWithoutPassword>(
            this.maskProp(bankAccountResult.getValue(), { prop: 'code', mask: BankAccountQueryUseCase.MASK_PROPS.code }),
        )
    }

    async queryManyByUserIdWithoutPassword(args: { userId: ID }) {
        const userId = this.validateDTO(args.userId, schemaNumber)

        const bankAccountsResult = await this.bankAccountRepository.findManyByUserIdWithoutPassword(userId)

        if (!bankAccountsResult.isSuccess()) {
            if (bankAccountsResult.isErrorInOperation()) {
                return Result.failure<BankAccountModel.BankAccountWithoutPassword[]>({ title: 'Query Bank Accounts', message: 'Unable to query bank accounts' })
            }

            return Result.failure<BankAccountModel.BankAccountWithoutPassword[]>({ title: 'Query Bank Accounts', message: 'Bank accounts not found' })
        }

        return Result.success<BankAccountModel.BankAccountWithoutPassword[]>(
            this.maskArray(bankAccountsResult.getValue(), { prop: 'code', mask: BankAccountQueryUseCase.MASK_PROPS.code }),
        )
    }

    async queryManyByUserIdWithoutPasswordAndBalance(args: { userId: ID }) {
        const userId = this.validateDTO(args.userId, schemaNumber)

        const bankAccountsResult = await this.bankAccountRepository.findManyByUserIdWithoutPasswordAndBalance(userId)

        if (!bankAccountsResult.isSuccess()) {
            if (bankAccountsResult.isErrorInOperation()) {
                return Result.failure<BankAccountModel.BankAccountWithoutPasswordAndBalance[]>({
                    title: 'Query Bank Accounts',
                    message: 'Unable to query bank accounts',
                })
            }

            return Result.failure<BankAccountModel.BankAccountWithoutPasswordAndBalance[]>({ title: 'Query Bank Accounts', message: 'Bank accounts not found' })
        }

        return Result.success<BankAccountModel.BankAccountWithoutPasswordAndBalance[]>(
            this.maskArray(bankAccountsResult.getValue(), { prop: 'code', mask: BankAccountQueryUseCase.MASK_PROPS.code }),
        )
    }
}
