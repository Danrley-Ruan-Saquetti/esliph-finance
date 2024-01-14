import { ID } from '@@types'
import { BadRequestException } from '@common/exceptions'
import { Result } from '@esliph/common'
import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { BankAccountRepository } from '@modules/bank-account/bank-account.repository'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'
import { CompensationPaymentsControl } from '@modules/payment/control/compensation-payments.control'
import { PaymentModel } from '@modules/payment/payment.model'

@Service({ name: 'balance-bank-account.control' })
export class BalanceBankAccountControl {
    private bankAccountId: ID
    private financialTransactions: {
        id: ID
        type: FinancialTransactionModel.Type
        situation: FinancialTransactionModel.Situation
        value: number
        dateTimeCompetence: Date
        payments: (PaymentModel.Model & { id: ID })[]
    }[]
    private state: { total: number }

    constructor(@Injection.Inject('bank-account.repository') private bankAccountRepository: BankAccountRepository) { }

    async loadComponents(bankAccountId: ID) {
        this.setBankAccountIdId(bankAccountId)
        await this.loadBankAccountAndFinancialTransactionWithPayments()
        this.loadState()
    }

    loadState() {
        const state = {
            total: 0,
        }

        this.financialTransactions.map(transaction => {
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

        this.state = {
            total: state.total,
        }
    }

    async loadBankAccountAndFinancialTransactionWithPayments() {
        const financialTransactionResult = await this.queryBankAccount(this.bankAccountId)

        this.financialTransactions = financialTransactionResult.financialTransactions.map(({ id, payments, situation, type, value, dateTimeCompetence }) => ({
            id,
            payments,
            situation,
            type,
            value,
            dateTimeCompetence,
        }))
    }

    private async queryBankAccount(bankAccountId: ID) {
        const bankAccount = await this.bankAccountRepository.findUnique({ where: { id: this.bankAccountId }, include: { financialTransactions: { include: { payments: true } } } })

        if (!bankAccount.isSuccess()) {
            if (bankAccount.isErrorInOperation()) {
                throw new BadRequestException({ title: 'Query Bank Account', message: 'Unable to query bank account' })
            }
            throw new BadRequestException({ title: 'Query Bank Account', message: 'Bank Account not found' })
        }

        return bankAccount.getValue()
    }

    getState() {
        return {
            bankAccountId: this.bankAccountId,
            ...this.state,
            financialTransactions: this.financialTransactions,
        }
    }

    setBankAccountIdId(bankAccountId: ID) {
        this.bankAccountId = bankAccountId
    }
    setFinancialTransactions(
        financialTransactions: {
            id: ID
            type: FinancialTransactionModel.Type
            situation: FinancialTransactionModel.Situation
            value: number
            dateTimeCompetence: Date
            payments: (PaymentModel.Model & { id: ID })[]
        }[],
    ) {
        this.financialTransactions = financialTransactions.map(({ id, payments, situation, type, value, dateTimeCompetence }) => ({
            id,
            payments,
            situation,
            type,
            value,
            dateTimeCompetence,
        }))
    }
}
