import { Prisma } from '@services/database.service'
import { Service } from '@core'
import { Repository } from '@services/repository.service'

type LogErrorGetPayloadTypes = boolean | null | undefined | { select?: Prisma.LogErrorSelect | null }
type LogErrorGetPayload<T extends boolean | null | undefined | { select?: Prisma.LogErrorSelect | null }> = Prisma.LogErrorGetPayload<T>
type LogErrorPropSelect<ArgsSelect extends LogErrorGetPayloadTypes> = LogErrorGetPayload<ArgsSelect>
type LogErrorFindResponse<ArgsSelect extends LogErrorGetPayloadTypes> = LogErrorPropSelect<ArgsSelect>

@Service({ name: 'log-error.repository' })
export class LogErrorRepository extends Repository {
    private static GLOBAL_MESSAGE = {
        create: {
            title: 'Register Log Error',
            success: 'Log Error successfully registered',
            failed: 'Failed to register log error'
        },
        remove: {
            title: 'Remove Log Error',
            success: 'Log Error successfully removed',
            failed: 'Failed to remove log error'
        },
        update: {
            title: 'Update Log Error',
            success: 'Log Error successfully updated',
            failed: 'Failed to update log error data'
        },
        find: {
            title: 'Find Log Error',
            notFound: 'Log Error not found',
            failed: 'Unable to query log error'
        },
        findMany: {
            title: 'Find Log Errors',
            failed: 'Unable to query log errors'
        }
    }

    async create(args: { data: Prisma.LogErrorCreateInput }) {
        try {
            await this.database.instance.logError.create({ ...args })

            return this.handleResponse<{ message: string }>({ message: LogErrorRepository.GLOBAL_MESSAGE.create.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: LogErrorRepository.GLOBAL_MESSAGE.create.title, message: LogErrorRepository.GLOBAL_MESSAGE.create.failed }
            })
        }
    }

    async update(args: { where: Prisma.LogErrorWhereUniqueInput, data: Prisma.LogErrorUpdateInput }) {
        try {
            await this.database.instance.logError.update({ ...args })

            return this.handleResponse<{ message: string }>({ message: LogErrorRepository.GLOBAL_MESSAGE.update.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: LogErrorRepository.GLOBAL_MESSAGE.update.title, message: LogErrorRepository.GLOBAL_MESSAGE.update.failed }
            })
        }
    }

    async delete(args: { where: Prisma.LogErrorWhereUniqueInput }) {
        try {
            await this.database.instance.logError.delete({ ...args })

            return this.handleResponse<{ message: string }>({ message: LogErrorRepository.GLOBAL_MESSAGE.remove.success })
        } catch (err: any) {
            return this.handleError<{ message: string }>(err, {
                error: { title: LogErrorRepository.GLOBAL_MESSAGE.remove.title, message: LogErrorRepository.GLOBAL_MESSAGE.remove.failed }
            })
        }
    }

    async findFirst<Args extends Prisma.LogErrorFindFirstArgs>(args: Args) {
        try {
            const logError = await this.database.instance.logError.findFirst(args) as LogErrorFindResponse<Args>

            return this.handleResponse<LogErrorFindResponse<Args>>(logError, {
                noAcceptNullable: true,
                error: { title: LogErrorRepository.GLOBAL_MESSAGE.find.title, message: LogErrorRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<LogErrorFindResponse<Args>>(err, {
                error: { title: LogErrorRepository.GLOBAL_MESSAGE.find.title, message: LogErrorRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findUnique<Args extends Prisma.LogErrorFindUniqueArgs>(args: Args) {
        try {
            const logError = await this.database.instance.logError.findUnique(args) as LogErrorFindResponse<Args>

            return this.handleResponse<LogErrorFindResponse<Args>>(logError, {
                noAcceptNullable: true,
                error: { title: LogErrorRepository.GLOBAL_MESSAGE.find.title, message: LogErrorRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<LogErrorFindResponse<Args>>(err, {
                error: { title: LogErrorRepository.GLOBAL_MESSAGE.find.title, message: LogErrorRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }

    async findMany<Args extends Prisma.LogErrorFindManyArgs>(args: Args) {
        try {
            const logError = await this.database.instance.logError.findMany(args) as LogErrorFindResponse<Args>[]

            return this.handleResponse<LogErrorFindResponse<Args>[]>(logError, {
                noAcceptNullable: true,
                error: { title: LogErrorRepository.GLOBAL_MESSAGE.find.title, message: LogErrorRepository.GLOBAL_MESSAGE.find.notFound },
            })
        } catch (err: any) {
            return this.handleError<LogErrorFindResponse<Args>[]>(err, {
                error: { title: LogErrorRepository.GLOBAL_MESSAGE.find.title, message: LogErrorRepository.GLOBAL_MESSAGE.find.failed }
            })
        }
    }
}
