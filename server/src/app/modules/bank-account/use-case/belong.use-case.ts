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
        const result = await this.financialTransactionRepository.findUnique({ where: { bankAccountId: Number(bankAccountId), id: Number(financialTransactionId) } })

        if (result.isErrorInOperation()) {
            throw new BadRequestException({ ...result.getError(), title: 'Verify is Transaction Belong Bank Account' })
        }

        return Result.success({ ok: result.isSuccess() })
    }

    async isCategoryBelongBankAccount({ bankAccountId, categoryId }: { categoryId: ID, bankAccountId: ID }) {
        const result = await this.categoryRepository.findFirst({ where: { bankAccountId: Number(bankAccountId), id: Number(categoryId) } })

        if (result.isErrorInOperation()) {
            throw new BadRequestException({ ...result.getError(), title: 'Verify is Category Belong Bank Account' })
        }

        return Result.success({ ok: result.isSuccess() })
    }

    async isNoteBelongBankAccount({ bankAccountId, noteId }: { noteId: ID, bankAccountId: ID }) {
        const result = await this.noteRepository.findByIdAndBankAccountId(Number(noteId), Number(bankAccountId))

        if (result.isErrorInOperation()) {
            throw new BadRequestException({ ...result.getError(), title: 'Verify is Note Belong Bank Account' })
        }

        return Result.success({ ok: result.isSuccess() })
    }

    async isPaymentBelongBankAccount({ bankAccountId, paymentId }: { paymentId: ID, bankAccountId: ID }) {
        const result = await this.paymentRepository.findByIdAndBankAccountId(Number(paymentId), Number(bankAccountId))

        if (result.isErrorInOperation()) {
            throw new BadRequestException({ ...result.getError(), title: 'Verify is Payment Belong Bank Account' })
        }

        return Result.success({ ok: result.isSuccess() })
    }
}