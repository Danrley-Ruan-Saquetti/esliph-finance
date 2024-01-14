import { Request } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Get, Put } from '@esliph/adapter-fastify'
import { Controller, Guard } from '@esliph/module'
import { PaymentQueryCompensationUseCase } from '@modules/payment/use-case/query-compensation.use-case'
import { FinancialTransactionQueryUseCase } from '@modules/financial-transaction/use-case/query.use-case'
import { NoteQueryUseCase } from '@modules/note/use-case/query.use-case'
import { FinancialTransactionUpdateUseCase } from '@modules/financial-transaction/use-case/update.use-case'
import { BankAccountBelongControl } from '@modules/bank-account/control/belong.control'

@Controller({ prefix: '/financial-transactions' })
export class FinancialTransactionController {
    constructor(
        @Injection.Inject('bank-account.control.belong') private bankAccountBelongControl: BankAccountBelongControl,
        @Injection.Inject('financial-transaction.use-case.query') private queryUC: FinancialTransactionQueryUseCase,
        @Injection.Inject('financial-transaction.use-case.update') private updateUC: FinancialTransactionUpdateUseCase,
        @Injection.Inject('payment.use-case.query-compensation') private queryCompensationUC: PaymentQueryCompensationUseCase,
        @Injection.Inject('note.use-case.query') private queryNotesUC: NoteQueryUseCase,
    ) { }

    @Guard({ name: 'bank-account.authorization' })
    @Get('')
    async get(req: Request) {
        const bankAccountId = req.headers['bankAccountId']
        const filters = req.params

        const result = await this.queryUC.queryManyByBankAccountIdWithCategories({ bankAccountId }, filters)

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @Get('/:id')
    async getOne(req: Request) {
        const id = req.params['id']

        await this.bankAccountBelongControl.verifyFinancialTransaction({ financialTransactionId: id, bankAccountId: req.headers['bankAccountId'] })

        const result = await this.queryUC.queryByIdWithNotesAndPaymentsAndCategories({ id })

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @Get('/:id/compensation')
    async getCompensation(req: Request) {
        const financialTransactionId = req.params['id']

        await this.bankAccountBelongControl.verifyFinancialTransaction({ financialTransactionId, bankAccountId: req.headers['bankAccountId'] })

        const result = await this.queryCompensationUC.perform({ financialTransactionId })

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @Get('/:id/notes')
    async getNotes(req: Request) {
        const financialTransactionId = req.params['id']

        await this.bankAccountBelongControl.verifyFinancialTransaction({ financialTransactionId, bankAccountId: req.headers['bankAccountId'] })

        const result = await this.queryNotesUC.queryManyByUFinancialTransactionId({ financialTransactionId })

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @Put('/:id/update')
    async update(req: Request) {
        const id = req.params['id']

        await this.bankAccountBelongControl.verifyFinancialTransaction({ financialTransactionId: id, bankAccountId: req.headers['bankAccountId'] })

        const result = await this.updateUC.perform({ ...req.body, id })

        return result
    }
}
