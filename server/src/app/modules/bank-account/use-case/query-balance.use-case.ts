import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { ID } from '@@types'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { GLOBAL_BANK_ACCOUNT_DTO } from '@modules/bank-account/bank-account.global'
import { BankAccountRepository } from '@modules/bank-account/bank-account.repository'
import { CompensationPaymentsControl } from '@modules/payment/control/compensation-payments.control'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'

const schemaDTO = ValidatorService.schema.object({
    bankAccountId: GLOBAL_BANK_ACCOUNT_DTO.id,
})

export type BankAccountQueryBalanceDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'bank-account.use-case.query-balance' })
export class BankAccountQueryBalanceUseCase extends UseCase {
    constructor(
        @Injection.Inject('bank-account.repository') private bankAccountRepository: BankAccountRepository,
        @Injection.Inject('bank-account.repository') private compensationPaymentsControl: CompensationPaymentsControl,
    ) {
        super()
    }

    async perform(args: BankAccountQueryBalanceDTOArgs) {
        const { bankAccountId } = this.validateDTO(args, schemaDTO)

        const { balance } = await this.queryBankAccount(bankAccountId)

        return Result.success({ balance })
    }

    private async queryBalance(bankAccountId: ID) {
        const { financialTransactions } = await this.queryBankAccount(bankAccountId)

        const state = {
            total: 0,
        }

        financialTransactions.map(transaction => {
            const compensationPaymentsControl = Injection.resolve(CompensationPaymentsControl)

            compensationPaymentsControl.setFinancialTransactionId(transaction.id)
            compensationPaymentsControl.setFinancialTransaction(transaction)
            compensationPaymentsControl.setPayments(transaction.payments)

            if (transaction.type === FinancialTransactionModel.Type.INCOME) {
                state.total += compensationPaymentsControl.getState().totalNetValuePaid
            } else if (transaction.type === FinancialTransactionModel.Type.EXPENSE) {
                state.total -= compensationPaymentsControl.getState().totalNetValuePaid
            }
        })

        return Result.success({ balance: state.total })
    }

    private async queryBankAccount(bankAccountId: ID) {
        const bankAccount = await this.bankAccountRepository.findByIdWithFinancialTransactionsAndPayments(bankAccountId)

        if (!bankAccount.isSuccess()) {
            if (bankAccount.isErrorInOperation()) {
                throw new BadRequestException({ title: 'Query Bank Account', message: 'Unable to query bank account' })
            }
            throw new BadRequestException({ title: 'Query Bank Account', message: 'Bank Account not found' })
        }

        return bankAccount.getValue()
    }
}
