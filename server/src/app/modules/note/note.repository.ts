import { Service } from '@esliph/module'
import { ID } from '@@types'
import { Repository } from '@services/repository.service'
import { NoteModel } from '@modules/note/note.model'

@Service({ name: 'note.repository' })
export class NoteRepository extends Repository {
    private static GLOBAL_MESSAGE = {
        create: {
            title: 'Register Note',
            success: 'Note successfully registered',
            failed: 'Failed to register note'
        },
        createMany: {
            title: 'Register Notes',
            success: 'Notes successfully registered',
            failed: 'Failed to register notes'
        },
        remove: {
            title: 'Remove Note',
            success: 'Note successfully removed',
            failed: 'Failed to remove note'
        },
        update: {
            title: 'Update Note',
            success: 'Note successfully updated',
            failed: 'Failed to update note data'
        },
        find: {
            title: 'Find Note',
            notFound: 'Note not found',
            failed: 'Unable to query note'
        },
        findMany: {
            title: 'Find Notes',
            failed: 'Unable to query notes'
        }
    }

    async register({ description, financialTransactionId }: NoteModel.Model) {
        try {
            await this.database.instance.note.create({ data: { description, financialTransactionId } })

            return this.handleResponse<{ message: string }>({ message: NoteRepository.GLOBAL_MESSAGE.create.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: NoteRepository.GLOBAL_MESSAGE.create.title, message: NoteRepository.GLOBAL_MESSAGE.create.failed }
            })
        }
    }

    async registerMany({ financialTransactionId, notes }: { financialTransactionId: ID, notes: { description: string }[] }) {
        try {
            await this.database.instance.note.createMany({ data: notes.map(note => ({ ...note, financialTransactionId })) })

            return this.handleResponse<{ message: string }>({ message: NoteRepository.GLOBAL_MESSAGE.createMany.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: NoteRepository.GLOBAL_MESSAGE.createMany.title, message: NoteRepository.GLOBAL_MESSAGE.createMany.failed }
            })
        }
    }

    async removeById(id: ID) {
        try {
            await this.database.instance.note.delete({ where: { id } })

            return this.handleResponse<{ message: string }>({ message: NoteRepository.GLOBAL_MESSAGE.remove.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: NoteRepository.GLOBAL_MESSAGE.remove.title, message: NoteRepository.GLOBAL_MESSAGE.remove.failed }
            })
        }
    }

    async updateById(args: { description: string }, where: { id: ID }) {
        try {
            await this.database.instance.note.update({ where: { id: where.id }, data: args })

            return this.handleResponse<{ message: string }>({ message: NoteRepository.GLOBAL_MESSAGE.update.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: NoteRepository.GLOBAL_MESSAGE.update.title, message: NoteRepository.GLOBAL_MESSAGE.update.failed }
            })
        }
    }

    async findById(id: ID) {
        try {
            const note = await this.database.instance.note.findFirst({ where: { id } })

            return this.handleResponse<NoteModel.Note>(note, {
                noAcceptNullable: true,
                error: { title: NoteRepository.GLOBAL_MESSAGE.find.title, message: NoteRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<NoteModel.Note>(err, {
                error: { title: NoteRepository.GLOBAL_MESSAGE.find.title, message: NoteRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findByIdAndFinancialTransactionId(id: ID, financialTransactionId: ID) {
        try {
            const note = await this.database.instance.note.findFirst({ where: { id, financialTransactionId } })

            return this.handleResponse<NoteModel.Note>(note, {
                noAcceptNullable: true,
                error: { title: NoteRepository.GLOBAL_MESSAGE.find.title, message: NoteRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<NoteModel.Note>(err, {
                error: { title: NoteRepository.GLOBAL_MESSAGE.find.title, message: NoteRepository.GLOBAL_MESSAGE.find.failed },
            })
        }
    }

    async findByIdAndBankAccountId(id: ID, bankAccountId: ID) {
        try {
            const note = await this.database.instance.note.findFirst({ where: { id, financialTransaction: { bankAccountId } } })

            return this.handleResponse<NoteModel.Note>(note, {
                noAcceptNullable: true,
                error: { title: NoteRepository.GLOBAL_MESSAGE.find.title, message: NoteRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<NoteModel.Note>(err, {
                error: { title: NoteRepository.GLOBAL_MESSAGE.find.title, message: NoteRepository.GLOBAL_MESSAGE.find.failed },
            })
        }
    }

    async findManyByFinancialTransactionId(financialTransactionId: ID) {
        try {
            const users = await this.database.instance.note.findMany({
                where: { financialTransactionId },
                orderBy: { createdAt: 'desc' }
            })

            return this.handleResponse<NoteModel.Note[]>(users)
        } catch (err: any) {
            return this.handleError<NoteModel.Note[]>(err, {
                error: { title: NoteRepository.GLOBAL_MESSAGE.find.title, message: NoteRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }
}
