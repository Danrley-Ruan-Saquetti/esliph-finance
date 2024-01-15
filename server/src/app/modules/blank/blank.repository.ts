import { Prisma } from '@prisma/client'
import { Service } from '@esliph/module'
import { Repository } from '@services/repository.service'

type BlankGetPayloadTypes = boolean | null | undefined | { select?: Prisma.BlankSelect | null }
type BlankGetPayload<T extends boolean | null | undefined | { select?: Prisma.BlankSelect | null }> = Prisma.BlankGetPayload<T>
type BlankPropSelect<ArgsSelect extends BlankGetPayloadTypes> = BlankGetPayload<ArgsSelect>
type BlankFindResponse<ArgsSelect extends BlankGetPayloadTypes> = BlankPropSelect<ArgsSelect>

@Service({ name: 'blank.repository' })
export class BlankRepository extends Repository {
    private static GLOBAL_MESSAGE = {
        create: {
            title: 'Register Blank',
            success: 'Blank successfully registered',
            failed: 'Failed to register blank'
        },
        remove: {
            title: 'Remove Blank',
            success: 'Blank successfully removed',
            failed: 'Failed to remove blank'
        },
        update: {
            title: 'Update Blank',
            success: 'Blank successfully updated',
            failed: 'Failed to update blank data'
        },
        find: {
            title: 'Find Blank',
            notFound: 'Blank not found',
            failed: 'Unable to query blank'
        },
        findMany: {
            title: 'Find Blanks',
            failed: 'Unable to query blanks'
        }
    }

    async create(args: { data: Prisma.BlankCreateInput }) {
        try {
            await this.database.instance.blank.create({ ...args })

            return this.handleResponse<{ message: string }>({ message: BlankRepository.GLOBAL_MESSAGE.create.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: BlankRepository.GLOBAL_MESSAGE.create.title, message: BlankRepository.GLOBAL_MESSAGE.create.failed }
            })
        }
    }

    async update(args: { where: Prisma.BlankWhereUniqueInput, data: Prisma.BlankUpdateInput }) {
        try {
            await this.database.instance.blank.update({ ...args })

            return this.handleResponse<{ message: string }>({ message: BlankRepository.GLOBAL_MESSAGE.update.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: BlankRepository.GLOBAL_MESSAGE.update.title, message: BlankRepository.GLOBAL_MESSAGE.update.failed }
            })
        }
    }

    async delete(args: { where: Prisma.BlankWhereUniqueInput }) {
        try {
            await this.database.instance.blank.delete({ ...args })

            return this.handleResponse<{ message: string }>({ message: BlankRepository.GLOBAL_MESSAGE.remove.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: BlankRepository.GLOBAL_MESSAGE.remove.title, message: BlankRepository.GLOBAL_MESSAGE.remove.failed }
            })
        }
    }

    async findFirst<Args extends Prisma.BlankFindFirstArgs>(args: Args) {
        try {
            const blank = await this.database.instance.blank.findFirst(args) as BlankFindResponse<Args>

            return this.handleResponse<BlankFindResponse<Args>>(blank, {
                noAcceptNullable: true,
                error: { title: BlankRepository.GLOBAL_MESSAGE.find.title, message: BlankRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<BlankFindResponse<Args>>(err, {
                error: { title: BlankRepository.GLOBAL_MESSAGE.find.title, message: BlankRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findUnique<Args extends Prisma.BlankFindUniqueArgs>(args: Args) {
        try {
            const blank = await this.database.instance.blank.findUnique(args) as BlankFindResponse<Args>

            return this.handleResponse<BlankFindResponse<Args>>(blank, {
                noAcceptNullable: true,
                error: { title: BlankRepository.GLOBAL_MESSAGE.find.title, message: BlankRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<BlankFindResponse<Args>>(err, {
                error: { title: BlankRepository.GLOBAL_MESSAGE.find.title, message: BlankRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findMany<Args extends Prisma.BlankFindManyArgs>(args: Args) {
        try {
            const blank = await this.database.instance.blank.findMany(args) as BlankFindResponse<Args>[]

            return this.handleResponse<BlankFindResponse<Args>[]>(blank, {
                noAcceptNullable: true,
                error: { title: BlankRepository.GLOBAL_MESSAGE.find.title, message: BlankRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<BlankFindResponse<Args>[]>(err, {
                error: { title: BlankRepository.GLOBAL_MESSAGE.find.title, message: BlankRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }
}
