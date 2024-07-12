import { Note as NotePrisma, Prisma } from '@prisma/client'
import { NotFoundException } from '@exceptions/not-found'
import { DatabaseException } from '@exceptions/database'
import { DatabaseRepository, GenerateGlobalMessagesRepository } from '@common/repository'

type NoteGetPayloadTypes = boolean | null | undefined | { select?: Prisma.NoteSelect | null }
type NoteGetPayload<T extends boolean | null | undefined | { select?: Prisma.NoteSelect | null }> = Prisma.NoteGetPayload<T>
type NotePropSelect<ArgsSelect extends NoteGetPayloadTypes> = NoteGetPayload<ArgsSelect>
type NoteFindResponse<ArgsSelect extends NoteGetPayloadTypes> = NotePropSelect<ArgsSelect>

export namespace NoteModel {
    export type Note = NotePrisma

    export class Repository extends DatabaseRepository {
        private static MESSAGES = GenerateGlobalMessagesRepository('note')

        async create(args: Prisma.NoteCreateArgs) {
            try {
                return await this.repo.create({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.create.title,
                    message: Repository.MESSAGES.create.failed,
                })
            }
        }

        async createMany(args: Prisma.NoteCreateManyArgs) {
            try {
                return await this.repo.createMany({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.createMany.title,
                    message: Repository.MESSAGES.createMany.failed,
                })
            }
        }

        async update(args: Prisma.NoteUpdateArgs) {
            try {
                return await this.repo.update({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.update.title,
                    message: Repository.MESSAGES.update.failed,
                })
            }
        }

        async updateMany(args: Prisma.NoteUpdateManyArgs) {
            try {
                return await this.repo.updateMany({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.updateMany.title,
                    message: Repository.MESSAGES.updateMany.failed,
                })
            }
        }

        async delete(args: Prisma.NoteDeleteArgs) {
            try {
                return await this.repo.delete({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.delete.title,
                    message: Repository.MESSAGES.delete.failed,
                })
            }
        }

        async deleteMany(args: Prisma.NoteDeleteManyArgs) {
            try {
                return await this.repo.deleteMany({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.deleteMany.title,
                    message: Repository.MESSAGES.deleteMany.failed,
                })
            }
        }

        async checkExistsOrTrow(args: Prisma.NoteFindFirstArgs) {
            await this.findFirstOrThrow(args)
        }

        async isExists(args: Prisma.NoteFindFirstArgs) {
            return !!(await this.findFirst(args))
        }

        async findFirstOrThrow<Args extends Prisma.NoteFindFirstArgs>(args: Args) {
            const note = await this.findFirst<Args>({ ...args })

            if (!note)
                throw new NotFoundException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.notFound,
                })

            return note as NoteFindResponse<Args>
        }
        async findFirst<Args extends Prisma.NoteFindFirstArgs>(args: Args) {
            try {
                return await this.repo.findFirst({ ...args }) as NoteFindResponse<Args> | null
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.failed,
                })
            }
        }

        async findUniqueOrThrow<Args extends Prisma.NoteFindUniqueArgs>(args: Args) {
            const note = await this.findUnique<Args>({ ...args })

            if (!note)
                throw new NotFoundException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.notFound,
                })

            return note as NoteFindResponse<Args>
        }

        async findUnique<Args extends Prisma.NoteFindUniqueArgs>(args: Args) {
            try {
                return await this.repo.findUnique({ ...args }) as NoteFindResponse<Args> | null
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.find.title,
                    message: Repository.MESSAGES.find.failed,
                })
            }
        }

        async query<Args extends Prisma.NoteFindManyArgs>(args: Args, page: { pageIndex: number, limite: number }) {
            const total = await this.count({ where: args.where })

            const notes = await this.findMany<Args>({
                ...args,
                skip: page.pageIndex * page.limite,
                take: page.limite
            })

            return {
                notes: notes as NoteFindResponse<Args>[] || [],
                metadata: {
                    currentPage: page.pageIndex + 1,
                    itemsPerPage: page.limite,
                    totalItems: total,
                    totalPages: Math.ceil(total / page.limite),
                }
            }
        }

        async findMany<Args extends Prisma.NoteFindManyArgs>(args: Args) {
            try {
                return await this.repo.findMany({ ...args }) as NoteFindResponse<Args>[]
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.findMany.title,
                    message: Repository.MESSAGES.findMany.failed,
                })
            }
        }

        async count(args: Prisma.NoteCountArgs) {
            try {
                return await this.repo.count({ ...args })
            } catch (err: any) {
                throw new DatabaseException({
                    title: Repository.MESSAGES.count.title,
                    message: Repository.MESSAGES.count.failed,
                })
            }
        }

        private get repo() { return this.database.instance.note }
    }

    export const noteRepository = new Repository()
}