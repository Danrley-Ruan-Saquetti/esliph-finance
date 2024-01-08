import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { Result } from '@esliph/common'
import { ID } from '@@types'
import { UseCase } from '@common/use-case'
import { ValidatorService } from '@services/validator.service'
import { NoteModel } from '@modules/note/note.model'
import { NoteRepository } from '@modules/note/note.repository'

@Service({ name: 'note.use-case.query' })
export class NoteQueryUseCase extends UseCase {
    constructor(@Injection.Inject('note.repository') private noteRepository: NoteRepository) {
        super()
    }

    async queryById(args: { id: ID }) {
        const id = Number(args.id)

        if (!id) {
            return Result.failure<NoteModel.Note[]>({ title: 'Query Notes', message: 'ID Note not defined' })
        }

        const noteResult = await this.noteRepository.findById(id)

        if (!noteResult.isSuccess()) {
            if (noteResult.isErrorInOperation()) {
                return Result.failure<NoteModel.Note>({ title: 'Query Note', message: 'Unable to query note' })
            }

            return Result.failure<NoteModel.Note>({ title: 'Query Note', message: 'note not found' })
        }

        return Result.success<NoteModel.Note>(noteResult.getValue())
    }

    async queryManyByUFinancialTransactionId(args: { financialTransactionId: ID }) {
        const financialTransactionId = Number(args.financialTransactionId)

        if (!financialTransactionId) {
            return Result.failure<NoteModel.Note[]>({ title: 'Query Notes', message: 'ID Financial Transaction not defined' })
        }

        const notesResult = await this.noteRepository.findManyByFinancialTransactionId(financialTransactionId)

        if (!notesResult.isSuccess()) {
            if (notesResult.isErrorInOperation()) {
                return Result.failure<NoteModel.Note[]>({ title: 'Query Notes', message: 'Unable to query notes' })
            }

            return Result.failure<NoteModel.Note[]>({ title: 'Query Notes', message: 'notes not found' })
        }

        return Result.success<NoteModel.Note[]>(notesResult.getValue())
    }
}
