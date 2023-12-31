import { Request } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Delete, Get, Post, Put } from '@esliph/adapter-fastify'
import { Controller, Guard } from '@esliph/module'
import { NoteQueryUseCase } from '@modules/note/use-case/query.use-case'
import { NoteRemoveUseCase } from '@modules/note/use-case/remove.use-case'
import { NoteUpdateUseCase } from '@modules/note/use-case/update.use-case'
import { NoteCreateManyUseCase } from '@modules/note/use-case/create.use-case'
import { BankAccountBelongControl } from '@modules/bank-account/control/belong.control'

@Controller({ prefix: '/notes' })
export class NoteController {
    constructor(
        @Injection.Inject('bank-account.control.belong') private bankAccountBelongControl: BankAccountBelongControl,
        @Injection.Inject('note.use-case.create-many') private createManyUC: NoteCreateManyUseCase,
        @Injection.Inject('note.use-case.query') private queryUC: NoteQueryUseCase,
        @Injection.Inject('note.use-case.remove') private removeUC: NoteRemoveUseCase,
        @Injection.Inject('note.use-case.update') private updateUC: NoteUpdateUseCase,
    ) { }

    @Guard({ name: 'bank-account.authorization' })
    @Get('')
    async get(req: Request) {
        const financialTransactionId = req.params['financialTransactionId']

        const result = await this.queryUC.queryManyByUFinancialTransactionId({ financialTransactionId })

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @Get('/:id')
    async getOne(req: Request) {
        const id = req.params['id']

        await this.bankAccountBelongControl.verifyNote({ noteId: id, bankAccountId: req.headers['bankAccountId'] })

        const result = await this.queryUC.queryById({ id })

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @Post('/create')
    async create(req: Request) {
        const financialTransactionId = req.params['financialTransactionId']

        const result = await this.createManyUC.perform({ financialTransactionId, notes: [{ ...req.body }] })

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @Put('/:id')
    async update(req: Request) {
        const id = req.params['id']

        await this.bankAccountBelongControl.verifyNote({ noteId: id, bankAccountId: req.headers['bankAccountId'] })

        const result = await this.updateUC.perform({ ...req.body, id })

        return result
    }

    @Guard({ name: 'bank-account.authorization' })
    @Delete('/:id/remove')
    async remove(req: Request) {
        const id = req.params['id']

        await this.bankAccountBelongControl.verifyNote({ noteId: id, bankAccountId: req.headers['bankAccountId'] })

        const result = await this.removeUC.perform({ id })

        return result
    }
}
