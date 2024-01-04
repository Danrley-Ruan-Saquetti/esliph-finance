import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { Result } from '@esliph/common'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { ValidatorService } from '@services/validator.service'
import { NoteModel } from '@modules/note/note.model'
import { NoteRepository } from '@modules/note/note.repository'

const schemaNumber = ValidatorService.schema.coerce.number()

@Service({ name: 'note.use-case.query' })
export class NoteQueryUseCase extends UseCase {
    constructor(
        @Injection.Inject('note.repository') private repository: NoteRepository,
    ) { super() }

    async queryById(args: { id: ID }) {
        const id = this.validateDTO(args.id, schemaNumber)

        const bankAccountResult = await this.repository.findById(id)

        if (!bankAccountResult.isSuccess()) {
            if (bankAccountResult.isErrorInOperation()) {
                return Result.failure<NoteModel.Note>({ title: 'Query Note', message: 'Unable to query note' })
            }

            return Result.failure<NoteModel.Note>({ title: 'Query Note', message: 'note not found' })
        }

        return Result.success<NoteModel.Note>(bankAccountResult.getValue())
    }

    async queryManyByUFinancialTransactionId(args: { financialTransactionId: ID }) {
        const financialTransactionId = this.validateDTO(args.financialTransactionId, schemaNumber)

        const notesResult = await this.repository.findManyByFinancialTransactionId(financialTransactionId)

        if (!notesResult.isSuccess()) {
            if (notesResult.isErrorInOperation()) {
                return Result.failure<NoteModel.Note[]>({ title: 'Query Notes', message: 'Unable to query notes' })
            }

            return Result.failure<NoteModel.Note[]>({ title: 'Query Notes', message: 'notes not found' })
        }

        return Result.success<NoteModel.Note[]>(notesResult.getValue())
    }
}
