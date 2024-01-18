import { Injection, Service, Result } from '@core'
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

        const bankAccountResult = await this.bankAccountRepository.findUnique({ where: { id }, select: BankAccountModel.BankAccountWithoutPasswordSelect })

        if (!bankAccountResult.isSuccess()) {
            return Result.failure<BankAccountModel.BankAccountWithoutPassword>({ ...bankAccountResult.getError(), title: 'Query Bank Account' })
        }

        return Result.success<BankAccountModel.BankAccountWithoutPassword>(bankAccountResult.getValue())
    }

    async queryByIdCodeMaskWithoutPassword(args: { id: ID }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const bankAccountResult = await this.bankAccountRepository.findUnique({ where: { id }, select: BankAccountModel.BankAccountWithoutPasswordSelect })

        if (!bankAccountResult.isSuccess()) {
            return Result.failure<BankAccountModel.BankAccountWithoutPassword>({ ...bankAccountResult.getError(), title: 'Query Bank Account' })
        }

        return Result.success<BankAccountModel.BankAccountWithoutPassword>(
            this.maskProp(bankAccountResult.getValue(), { prop: 'code', mask: BankAccountQueryUseCase.MASK_PROPS.code }),
        )
    }

    async queryByIdCodeMaskWithoutPasswordWhitMask(args: { id: ID }, options: { masks?: (keyof BankAccountModel.BankAccountWithoutPassword)[] } = {}) {
        const id = this.validateDTO(args.id, schemaNumber)

        const bankAccountResult = await this.bankAccountRepository.findUnique({ where: { id }, select: BankAccountModel.BankAccountWithoutPasswordSelect })

        if (!bankAccountResult.isSuccess()) {
            return Result.failure<BankAccountModel.BankAccountWithoutPassword>({ ...bankAccountResult.getError(), title: 'Query Bank Account' })
        }

        return Result.success<BankAccountModel.BankAccountWithoutPassword>(
            this.maskProp(bankAccountResult.getValue(), { prop: 'code', mask: BankAccountQueryUseCase.MASK_PROPS.code }),
        )
    }

    async queryByCodeWithoutPassword({ code }: { code: string }) {
        const bankAccountResult = await this.bankAccountRepository.findUnique({ where: { code }, select: BankAccountModel.BankAccountWithoutPasswordSelect })

        if (!bankAccountResult.isSuccess()) {
            return Result.failure<BankAccountModel.BankAccountWithoutPassword>({ ...bankAccountResult.getError(), title: 'Query Bank Account' })
        }

        return Result.success<BankAccountModel.BankAccountWithoutPassword>(bankAccountResult.getValue())
    }

    async queryByCodeWithoutPasswordWithMask({ code }: { code: string }) {
        const bankAccountResult = await this.bankAccountRepository.findUnique({ where: { code }, select: BankAccountModel.BankAccountWithoutPasswordSelect })

        if (!bankAccountResult.isSuccess()) {
            return Result.failure<BankAccountModel.BankAccountWithoutPassword>({ ...bankAccountResult.getError(), title: 'Query Bank Account' })
        }

        return Result.success<BankAccountModel.BankAccountWithoutPassword>(
            this.maskProp(bankAccountResult.getValue(), { prop: 'code', mask: BankAccountQueryUseCase.MASK_PROPS.code }),
        )
    }

    async queryManyByPeopleIdWithoutPassword(args: { peopleId: ID }) {
        const peopleId = this.validateDTO(args.peopleId, schemaNumber)

        const bankAccountsResult = await this.bankAccountRepository.findMany({ where: { peopleId }, select: BankAccountModel.BankAccountWithoutPasswordSelect })

        if (!bankAccountsResult.isSuccess()) {
            return Result.failure<BankAccountModel.BankAccountWithoutPassword[]>({ ...bankAccountsResult.getError(), title: 'Query Bank Accounts' })
        }

        return Result.success<BankAccountModel.BankAccountWithoutPassword[]>(
            this.maskArray(bankAccountsResult.getValue(), { prop: 'code', mask: BankAccountQueryUseCase.MASK_PROPS.code }),
        )
    }

    async queryManyByPeopleIdWithoutPasswordAndBalance(args: { peopleId: ID }) {
        const peopleId = this.validateDTO(args.peopleId, schemaNumber)

        const bankAccountsResult = await this.bankAccountRepository.findMany({ where: { peopleId }, select: BankAccountModel.BankAccountWithoutPasswordAndBalanceSelect })

        if (!bankAccountsResult.isSuccess()) {
            return Result.failure<BankAccountModel.BankAccountWithoutPasswordAndBalance[]>({
                ...bankAccountsResult.getError(),
                title: 'Query Bank Accounts',
            })
        }

        return Result.success<BankAccountModel.BankAccountWithoutPasswordAndBalance[]>(
            this.maskArray(bankAccountsResult.getValue(), { prop: 'code', mask: BankAccountQueryUseCase.MASK_PROPS.code }),
        )
    }
}
