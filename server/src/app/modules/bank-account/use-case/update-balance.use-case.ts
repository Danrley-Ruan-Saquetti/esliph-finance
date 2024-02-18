import { Service, Injection, Result } from '@core'
import { UseCase } from '@common/use-case'
import { ID } from '@@types'
import { SchemaValidator } from '@services/validator.service'
import { BadRequestException } from '@common/exceptions/bad-request.exception'
import { GLOBAL_BANK_ACCOUNT_DTO, GLOBAL_BANK_ACCOUNT_RULES } from '@modules/bank-account/bank-account.global'
import { BankAccountRepository } from '@modules/bank-account/bank-account.repository'

const schemaDTO = SchemaValidator.object({
    id: GLOBAL_BANK_ACCOUNT_DTO.id,
    value: SchemaValidator
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
        const { id, value } = this.validateDTO(args, schemaDTO)
        const result = await this.perform({ id, value })

        return result
    }

    async liquidate(args: BankAccountBalanceDTOArgs) {
        const { id, value } = this.validateDTO(args, schemaDTO)
        const result = await this.perform({ id, value: value * -1 })

        return result
    }

    private async perform({ id, value }: BankAccountBalanceDTOArgs) {
        if (value == 0) {
            return Result.success({ message: 'Balance successfully updated' })
        }

        await this.update(value, id)

        return Result.success({ message: 'Balance successfully updated' })
    }

    private async update(value: number, id: ID) {
        const updateResult = await this.repositoryBankAccount.update({ where: { id }, data: { balance: { increment: value } } })

        if (!updateResult.isSuccess()) {
            throw new BadRequestException({
                ...updateResult.getError(),
                title: 'Update Bank Account'
            })
        }
    }
}
