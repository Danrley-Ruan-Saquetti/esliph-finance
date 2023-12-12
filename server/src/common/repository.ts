import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { ErrorResultInfo, Result } from '@esliph/common'
import { DatabaseException, Exception, ResultException, ServerInternalErrorException } from '@common/exceptions'
import { DatabaseService, Prisma } from '@services/database.service'
import { isNull } from '../util'

type RepositoryResponseOptions = {
    noThrow: boolean
    error: Partial<ErrorResultInfo>
}

@Service()
export class Repository {
    constructor(@Injection.Inject('database') protected database: DatabaseService) { }

    protected performResponse<T = any>(res: T, options: Partial<RepositoryResponseOptions> = {}) {
        return Repository.validResultRepository<T>(res, options)
    }

    protected performError<T = any>(error: any, options: Partial<RepositoryResponseOptions> = {}) {
        return Repository.validErrorRepository<T>(error, options)
    }

    private static validResultRepository<T = any>(result: T, options: Partial<RepositoryResponseOptions> = {}) {
        if (!options.noThrow) {
            if (result instanceof Result) {
                if (!result.isSuccess() || isNull(result.getValue())) {
                    throw new DatabaseException({ ...result.getError(), ...options.error })
                }
            }

            if (isNull(result)) {
                throw new DatabaseException({ message: 'No result in operation', ...options.error })
            }
        }

        return result
    }

    private static validErrorRepository<T = any>(error: T, options: Partial<RepositoryResponseOptions> = {}) {
        if (!options.noThrow) {
            if (error instanceof Error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    throw new DatabaseException({ causes: [], title: 'Database', ...error, ...options.error })
                }

                if (error instanceof Exception) {
                    throw error
                }

                throw new ServerInternalErrorException({ ...error })
            }
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return Result.failure({ title: 'Database', ...error, ...options.error })
        }

        if (error instanceof ResultException) {
            return Result.failure({ title: 'Database', ...error.getError() })
        }

        if (error instanceof Result) {
            return Result.failure({ ...error.getError() })
        }

        return Result.failure({ title: 'Database', message: 'Error on operation database', ...error })
    }
}