import { ID } from '@@types'
import { BadRequestException } from '@common/exceptions'
import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { BankAccountRepository } from '@modules/bank-account/bank-account.repository'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'
import { CompensationPaymentsControl } from '@modules/payment/control/compensation-payments.control'

@Service({ name: 'balance-bank-account.control' })
export class BalanceBankAccountControl {
    constructor(@Injection.Inject('bank-account.repository') private bankAccountRepository: BankAccountRepository) {}

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
