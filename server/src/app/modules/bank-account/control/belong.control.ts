import { Injection, Service } from '@core'
import { ID } from '@@types'
import { BadRequestException } from '@common/exceptions'
import { BankAccountBelongUseCase } from '@modules/bank-account/use-case/belong.use-case'

@Service({ name: 'bank-account.control.belong' })
export class BankAccountBelongControl {
    constructor(@Injection.Inject('bank-account.use-case.belong') private belongUC: BankAccountBelongUseCase) { }

    async verifyNote({ bankAccountId, noteId }: { bankAccountId: ID, noteId: ID }) {
        const result = await this.belongUC.isNoteBelongBankAccount({ bankAccountId, noteId })

        if (result.isSuccess() && !result.getValue().ok) {
            throw new BadRequestException({ title: 'Verify Note of the Bank Account', message: 'Note not found' })
        }
    }

    async verifyFinancialTransaction({ bankAccountId, financialTransactionId }: { bankAccountId: ID, financialTransactionId: ID }) {
        const result = await this.belongUC.isFinancialTransactionBelongBankAccount({ bankAccountId, financialTransactionId })

        if (result.isSuccess() && !result.getValue().ok) {
            throw new BadRequestException({ title: 'Verify Financial Transaction of the Bank Account', message: 'Financial Transaction not found' })
        }
    }

    async verifyPayment({ bankAccountId, paymentId }: { bankAccountId: ID, paymentId: ID }) {
        const result = await this.belongUC.isPaymentBelongBankAccount({ bankAccountId, paymentId })

        if (result.isSuccess() && !result.getValue().ok) {
            throw new BadRequestException({ title: 'Verify Payment of the Bank Account', message: 'Payment not found' })
        }
    }

    async verifyCategory({ bankAccountId, categoryId }: { bankAccountId: ID, categoryId: ID }) {
        const result = await this.belongUC.isCategoryBelongBankAccount({ bankAccountId, categoryId })

        if (result.isSuccess() && !result.getValue().ok) {
            throw new BadRequestException({ title: 'Verify Category of the Bank Account', message: 'Category not found' })
        }
    }
}