import { Result, Injection, Service } from '@core'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { SchemaValidator, ValidatorService } from '@services/validator.service'
import { BankAccountRepository } from '@modules/bank-account/bank-account.repository'
import { BalanceBankAccountControl } from '@modules/bank-account/control/balance-bank-account.control'
import { FinancialTransactionModel } from '@modules/financial-transaction/financial-transaction.model'
import { GLOBAL_BANK_ACCOUNT_DTO, GLOBAL_BANK_ACCOUNT_RULES } from '@modules/bank-account/bank-account.global'

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
        @Injection.Inject('balance-bank-account.control') private balanceBankAccountControl: BalanceBankAccountControl,
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
        const bankAccount = await this.bankAccountRepository.findUnique({
            where: { id: bankAccountId }, include: {
                financialTransactions: {
                    where: {
                        dateTimeCompetence: {
                            gte: dateStart,
                            lte: dateEnd,
                        },
                    },
                    include: { payments: true },
                    orderBy: {}
                }
            }
        })

        if (!bankAccount.isSuccess()) {
            throw new BadRequestException({ ...bankAccount.getError(), title: 'Query Bank Account' })
        }

        return bankAccount.getValue()
    }
}
