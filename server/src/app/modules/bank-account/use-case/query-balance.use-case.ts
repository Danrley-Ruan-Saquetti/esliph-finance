import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { ID } from '@@types'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { GLOBAL_BANK_ACCOUNT_DTO, GLOBAL_BANK_ACCOUNT_RULES } from '@modules/bank-account/bank-account.global'
import { BankAccountRepository } from '@modules/bank-account/bank-account.repository'
import { CompensationPaymentsControl } from '@modules/payment/control/compensation-payments.control'
import { BalanceBankAccountControl } from '../control/balance-bank-account.control'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'

const schemaDTO = ValidatorService.schema.object({
    bankAccountId: GLOBAL_BANK_ACCOUNT_DTO.id,
    dateStart: ValidatorService.schema.coerce.date({ 'required_error': GLOBAL_BANK_ACCOUNT_RULES.queryBalance.dateStart.messageRequired }),
    dateEnd: ValidatorService.schema.coerce.date({ 'required_error': GLOBAL_BANK_ACCOUNT_RULES.queryBalance.dateEnd.messageRequired }),
})

export type BankAccountQueryBalanceDTOArgs = SchemaValidator.input<typeof schemaDTO>

@Service({ name: 'bank-account.use-case.query-balance' })
export class BankAccountQueryBalanceUseCase extends UseCase {
    constructor(
        @Injection.Inject('bank-account.repository') private bankAccountRepository: BankAccountRepository,
        @Injection.Inject('bank-account.repository') private balanceBankAccountControl: BalanceBankAccountControl,
    ) {
        super()
    }

    async perform(args: BankAccountQueryBalanceDTOArgs) {
        const { bankAccountId, dateStart, dateEnd } = this.validateDTO(args, schemaDTO)

        const { financialTransactions } = await this.queryBankAccount(bankAccountId, dateStart, dateEnd)
        const state = this.getState(bankAccountId, financialTransactions)

        return Result.success({ ...state })
    }

    getState(bankAccountId: ID, financialTransactions: FinancialTransactionModel.FinancialTransactionWithPayments[]) {
        this.balanceBankAccountControl.setBankAccountIdId(bankAccountId)
        this.balanceBankAccountControl.setFinancialTransactions(financialTransactions)
        this.balanceBankAccountControl.loadState()

        return this.balanceBankAccountControl.getState()
    }

    private async queryBankAccount(bankAccountId: ID, dateStart: Date, dateEnd: Date) {
        const bankAccount = await this.bankAccountRepository.findByIdAndBetweenDateCompetenceWithFinancialTransactionsAndPayments(
            bankAccountId,
            dateStart,
            dateEnd,
        )

        if (!bankAccount.isSuccess()) {
            if (bankAccount.isErrorInOperation()) {
                throw new BadRequestException({ title: 'Query Bank Account', message: 'Unable to query bank account' })
            }
            throw new BadRequestException({ title: 'Query Bank Account', message: 'Bank Account not found' })
        }

        return bankAccount.getValue()
    }
}
