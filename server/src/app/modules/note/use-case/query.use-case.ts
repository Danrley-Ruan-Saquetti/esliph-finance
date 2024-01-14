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

        const noteResult = await this.noteRepository.findUnique({ where: { id } })

        if (!noteResult.isSuccess()) {
            return Result.failure<NoteModel.Note>({ ...noteResult.getError(), title: 'Query Note' })
        }

        return Result.success<NoteModel.Note>(noteResult.getValue())
    }

    async queryManyByUFinancialTransactionId(args: { financialTransactionId: ID }) {
        const financialTransactionId = Number(args.financialTransactionId)

        if (!financialTransactionId) {
            return Result.failure<NoteModel.Note[]>({ title: 'Query Notes', message: 'ID Financial Transaction not defined' })
        }

        const notesResult = await this.noteRepository.findMany({ where: { financialTransactionId } })

        if (!notesResult.isSuccess()) {
            return Result.failure<NoteModel.Note[]>({ ...notesResult.getError(), title: 'Query Notes' })
        }

        return Result.success<NoteModel.Note[]>(notesResult.getValue())
    }
}
