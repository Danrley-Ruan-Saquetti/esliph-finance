import { Service } from '@core'
import { Prisma } from '@services/database.service'
import { Repository } from '@services/repository.service'

type NoteGetPayloadTypes = boolean | null | undefined | { select?: Prisma.NoteSelect | null }
type NoteGetPayload<T extends boolean | null | undefined | { select?: Prisma.NoteSelect | null }> = Prisma.NoteGetPayload<T>
type NotePropSelect<ArgsSelect extends NoteGetPayloadTypes> = NoteGetPayload<ArgsSelect>
type NoteFindResponse<ArgsSelect extends NoteGetPayloadTypes> = NotePropSelect<ArgsSelect>

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

    async create(args: { data: Prisma.NoteCreateInput }) {
        try {
            await this.database.instance.note.create({ ...args })

            return this.handleResponse<{ message: string }>({ message: NoteRepository.GLOBAL_MESSAGE.create.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: NoteRepository.GLOBAL_MESSAGE.create.title, message: NoteRepository.GLOBAL_MESSAGE.create.failed }
            })
        }
    }

    async createMany(args: { data: Prisma.NoteCreateManyInput[] }) {
        try {
            await this.database.instance.note.createMany({ ...args, skipDuplicates: true })

            return this.handleResponse<{ message: string }>({ message: NoteRepository.GLOBAL_MESSAGE.createMany.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: NoteRepository.GLOBAL_MESSAGE.createMany.title, message: NoteRepository.GLOBAL_MESSAGE.createMany.failed }
            })
        }
    }

    async update(args: { where: Prisma.NoteWhereUniqueInput, data: Prisma.NoteUpdateInput }) {
        try {
            await this.database.instance.note.update({ ...args })

            return this.handleResponse<{ message: string }>({ message: NoteRepository.GLOBAL_MESSAGE.update.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: NoteRepository.GLOBAL_MESSAGE.update.title, message: NoteRepository.GLOBAL_MESSAGE.update.failed }
            })
        }
    }

    async delete(args: { where: Prisma.NoteWhereUniqueInput }) {
        try {
            await this.database.instance.note.delete({ ...args })

            return this.handleResponse<{ message: string }>({ message: NoteRepository.GLOBAL_MESSAGE.remove.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: NoteRepository.GLOBAL_MESSAGE.remove.title, message: NoteRepository.GLOBAL_MESSAGE.remove.failed }
            })
        }
    }

    async findFirst<Args extends Prisma.NoteFindFirstArgs>(args: Args) {
        try {
            const note = await this.database.instance.note.findFirst(args) as NoteFindResponse<Args>

            return this.handleResponse<NoteFindResponse<Args>>(note, {
                noAcceptNullable: true,
                error: { title: NoteRepository.GLOBAL_MESSAGE.find.title, message: NoteRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<NoteFindResponse<Args>>(err, {
                error: { title: NoteRepository.GLOBAL_MESSAGE.find.title, message: NoteRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findUnique<Args extends Prisma.NoteFindUniqueArgs>(args: Args) {
        try {
            const note = await this.database.instance.note.findUnique(args) as NoteFindResponse<Args>

            return this.handleResponse<NoteFindResponse<Args>>(note, {
                noAcceptNullable: true,
                error: { title: NoteRepository.GLOBAL_MESSAGE.find.title, message: NoteRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<NoteFindResponse<Args>>(err, {
                error: { title: NoteRepository.GLOBAL_MESSAGE.find.title, message: NoteRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findMany<Args extends Prisma.NoteFindManyArgs>(args: Args) {
        try {
            const note = await this.database.instance.note.findMany(args) as NoteFindResponse<Args>[]

            return this.handleResponse<NoteFindResponse<Args>[]>(note, {
                noAcceptNullable: true,
                error: { title: NoteRepository.GLOBAL_MESSAGE.find.title, message: NoteRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<NoteFindResponse<Args>[]>(err, {
                error: { title: NoteRepository.GLOBAL_MESSAGE.find.title, message: NoteRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }
}
