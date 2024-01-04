import { Service } from '@esliph/module'
import { ID } from '@@types'
import { Repository } from '@services/repository.service'
import { NoteModel } from '@modules/note/note.model'

@Service({ name: 'note.repository' })
export class NoteRepository extends Repository {
    async register({ description, financialTransactionId }: NoteModel.Model) {
        try {
            await this.database.instance.note.create({ data: { description, financialTransactionId } })

            return this.handleResponse<{ message: string }>(
                { message: 'Note successfully registered' },
                { error: { title: 'Register Note', message: 'Note successfully registered' } },
            )
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, { error: { title: 'Register Note', message: 'Unable to register note' } })
        }
    }

    async registerMany({ financialTransactionId, notes }: { financialTransactionId: ID, notes: { description: string }[] }) {
        try {
            await this.database.instance.note.createMany({ data: notes.map(note => ({ ...note, financialTransactionId })) })

            return this.handleResponse<{ message: string }>(
                { message: 'Notes successfully registered' },
                { error: { title: 'Register Notes', message: 'Notes successfully registered' } },
            )
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, { error: { title: 'Register Notes', message: 'Unable to register notes' } })
        }
    }

    async updateById(args: NoteModel.Model, where: { id: number }) {
        try {
            await this.database.instance.note.update({ where: { id: where.id }, data: args })

            return this.handleResponse<{ message: string }>(
                { message: 'Note successfully updated' },
                { error: { title: 'Update Note', message: 'Note successfully updated' } },
            )
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, { error: { title: 'Update Note', message: 'Unable to update note' } })
        }
    }

    async findById(id: ID) {
        try {
            const note = await this.database.instance.note.findFirst({ where: { id } })

            return this.handleResponse<NoteModel.Note>(note, {
                noAcceptNullable: true,
                error: { title: 'Find Note', message: 'Note not found' },
            })
        } catch (err: any) {
            return this.handleError<NoteModel.Note>(err, { error: { title: 'Find Note', message: 'Note not found' } })
        }
    }

    async findManyByFinancialTransactionId(financialTransactionId: ID) {
        try {
            const users = await this.database.instance.note.findMany({ where: { financialTransactionId } })

            return this.handleResponse<NoteModel.Note[]>(users, { error: { title: 'Find Note', message: 'Note not found' } })
        } catch (err: any) {
            return this.handleError<NoteModel.Note[]>(err, { error: { title: 'Find Note', message: 'Unable to find note' } })
        }
    }

    async findManyByFinancialTransactionIdOrderIsFavorite(financialTransactionId: ID) {
        try {
            const users = await this.database.instance.note.findMany({ where: { financialTransactionId }, orderBy: { createdAt: 'desc' } })

            return this.handleResponse<NoteModel.Note[]>(users, { error: { title: 'Find Note', message: 'Note not found' } })
        } catch (err: any) {
            return this.handleError<NoteModel.Note[]>(err, { error: { title: 'Find Note', message: 'Unable to find note' } })
        }
    }
}
