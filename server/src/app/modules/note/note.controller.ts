import { Request } from '@esliph/http'
import { Injection } from '@esliph/injection'
import { Get } from '@esliph/adapter-fastify'
import { Controller, Guard } from '@esliph/module'
import { NoteQueryUseCase } from '@modules/note/use-case/query.use-case'

@Controller({ prefix: '/notes' })
export class NoteController {
    constructor(
        @Injection.Inject('note.use-case.query') private queryNotesUC: NoteQueryUseCase,
    ) { }

    @Guard({ name: 'bank-account.authorization' })
    @Get('')
    async get(req: Request) {
        const financialTransactionId = req.params['financialTransactionId']

        const result = await this.queryNotesUC.queryManyByUFinancialTransactionId({ financialTransactionId })

        return result
    }
}
