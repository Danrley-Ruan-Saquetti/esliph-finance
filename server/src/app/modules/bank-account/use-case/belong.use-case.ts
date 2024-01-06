import { Service } from '@esliph/module'
import { Injection } from '@esliph/injection'
import { Result } from '@esliph/common'
import { UseCase } from '@common/use-case'
import { BadRequestException } from '@common/exceptions'
import { ID } from '@@types'
import { FinancialTransactionRepository } from '@modules/financial-transaction/financial-transaction.repository'
import { CategoryRepository } from '@modules/category/category.repository'
import { PaymentRepository } from '@modules/payment/payment.repository'
import { NoteRepository } from '@modules/note/note.repository'

@Service({ name: 'bank-account.use-case.belong' })
export class BankAccountBelongUseCase extends UseCase {
    constructor(
        @Injection.Inject('financial-transaction.repository') private financialTransactionRepository: FinancialTransactionRepository,
        @Injection.Inject('category.repository') private categoryRepository: CategoryRepository,
        @Injection.Inject('note.repository') private noteRepository: NoteRepository,
        @Injection.Inject('payment.repository') private paymentRepository: PaymentRepository,
    ) {
        super()
    }

    async isFinancialTransactionBelongBankAccount({ bankAccountId, financialTransactionId }: { financialTransactionId: ID, bankAccountId: ID }) {
        const result = await this.financialTransactionRepository.findByIdAndBankAccountId(Number(financialTransactionId), Number(bankAccountId))

        if (result.isSuccess()) {
            return Result.success({ ok: true })
        }

        if (!result.isErrorInOperation()) {
            return Result.success({ ok: false })
        }

        throw new BadRequestException({ title: 'Verify is Transaction Belong Bank Account', message: `Unable to verify is transaction belong a bank account. Error: "${result.getError().message}"` })
    }

    async isCategoryBelongBankAccount({ bankAccountId, categoryId }: { categoryId: ID, bankAccountId: ID }) {
        const result = await this.categoryRepository.findByIdAndBankAccountId(Number(categoryId), Number(bankAccountId))

        if (result.isSuccess()) {
            return Result.success({ ok: true })
        }

        if (!result.isErrorInOperation()) {
            return Result.success({ ok: false })
        }

        throw new BadRequestException({ title: 'Verify is Category Belong Bank Account', message: `Unable to verify is category belong a bank account. Error: "${result.getError().message}"` })
    }

    async isNoteBelongBankAccount({ bankAccountId, noteId }: { noteId: ID, bankAccountId: ID }) {
        const result = await this.noteRepository.findByIdAndBankAccountId(Number(noteId), Number(bankAccountId))

        if (result.isSuccess()) {
            return Result.success({ ok: true })
        }

        if (!result.isErrorInOperation()) {
            return Result.success({ ok: false })
        }

        throw new BadRequestException({ title: 'Verify is Note Belong Bank Account', message: `Unable to verify is note belong a bank account. Error: "${result.getError().message}"` })
    }

    async isPaymentBelongBankAccount({ bankAccountId, paymentId }: { paymentId: ID, bankAccountId: ID }) {
        const result = await this.paymentRepository.findByIdAndBankAccountId(Number(paymentId), Number(bankAccountId))

        if (result.isSuccess()) {
            return Result.success({ ok: true })
        }

        if (!result.isErrorInOperation()) {
            return Result.success({ ok: false })
        }

        throw new BadRequestException({ title: 'Verify is Payment Belong Bank Account', message: `Unable to verify is payment belong a bank account. Error: "${result.getError().message}"` })
    }
}