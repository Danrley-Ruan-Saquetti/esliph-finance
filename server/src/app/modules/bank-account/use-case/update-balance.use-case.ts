import { BadRequestException } from './../../../../common/exceptions/bad-request.exception'
import { Service } from '@esliph/module'
import { UseCase } from '@common/use-case'
import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { ID } from '@@types'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { GLOBAL_BANK_ACCOUNT_DTO, GLOBAL_BANK_ACCOUNT_RULES } from '@modules/bank-account/bank-account.global'
import { BankAccountRepository } from '@modules/bank-account/bank-account.repository'

const schemaDTO = ValidatorService.schema.object({
    id: GLOBAL_BANK_ACCOUNT_DTO.id,
    value: ValidatorService.schema
        .coerce
        .number({
            'required_error': GLOBAL_BANK_ACCOUNT_RULES.updateBalance.value.valueRequest,
            'invalid_type_error': GLOBAL_BANK_ACCOUNT_RULES.updateBalance.value.messageMustBePositive,
        })
        .nonnegative({ message: GLOBAL_BANK_ACCOUNT_RULES.updateBalance.value.messageMustBePositive }),
})

export type BankAccountBalanceDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'bank-account.use-case.update-balance' })
export class BankAccountUpdateBalanceUseCase extends UseCase {
    constructor(@Injection.Inject('bank-account.repository') private repositoryBankAccount: BankAccountRepository) {
        super()
    }

    async receiver(args: BankAccountBalanceDTOArgs) {
        const result = await this.perform(args)

        return result
    }

    async liquidate(args: BankAccountBalanceDTOArgs) {
        const result = await this.perform({ ...args, value: args.value * -1 })

        return result
    }

    private async perform(args: BankAccountBalanceDTOArgs) {
        const { id, value } = this.validateDTO(args, schemaDTO)

        if (value == 0) {
            return Result.success({ message: 'Balance successfully updated' })
        }

        const { balance } = await this.queryBankAccount(id)
        const newValue = balance + value
        await this.update(newValue, id)

        return Result.success({ message: 'Balance successfully updated' })
    }

    private async queryBankAccount(id: ID) {
        const bankAccount = await this.repositoryBankAccount.findById(id)

        if (!bankAccount.isSuccess()) {
            throw new BadRequestException({
                ...bankAccount.getError(),
                title: 'Find Bank Account'
            })
        }

        return bankAccount.getValue()
    }

    private async update(newValue: number, id: ID) {
        const updateResult = await this.repositoryBankAccount.updateById({ balance: newValue }, { id })

        if (!updateResult.isSuccess()) {
            throw new BadRequestException({
                ...updateResult.getError(),
                title: 'Update Bank Account'
            })
        }
    }
}
