import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { ErrorResultInfo, Result } from '@esliph/common'
import { DatabaseException, Exception, ResultException, ServerInternalErrorException } from '@common/exceptions'
import { DatabaseService, Prisma } from '@services/database.service'
import { isNull } from '@util'
import { ResultDatabase } from '@common/result.database'

type RepositoryResponseOptions = {
    error: Partial<ErrorResultInfo>
}

@Service()
export class Repository {
    constructor(@Injection.Inject('database') protected database: DatabaseService) {}

    protected performResponse<T = any>(res: any, options: Partial<RepositoryResponseOptions> = {}) {
        return Repository.validResultRepository<T>(res, options)
    }

    protected performError<T = any>(error: any, options: Partial<RepositoryResponseOptions> = {}) {
        return Repository.validErrorRepository<T>(error, options)
    }

    private static validResultRepository<T = any>(result: any, options: Partial<RepositoryResponseOptions> = {}) {
        if (result instanceof Result) {
            if (!result.isSuccess() || isNull(result.getValue())) {
                return ResultDatabase.failure<T>({ ...result.getError(), ...options.error })
            }

            return ResultDatabase.success<T>({ ...(result.getResponse() as any) })
        }

        if (isNull(result)) {
            return ResultDatabase.failure<T>({ title: 'Database', message: 'No result in operation', ...options.error })
        }

        return ResultDatabase.success<T>(result)
    }

    private static validErrorRepository<T = any>(error: T, options: Partial<RepositoryResponseOptions> = {}) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return ResultDatabase.errorOperation<T>({
                title: 'Database',
                ...options.error,
                ...error,
                causes: { message: error.message, origin: (error.meta as any).target.join(';') },
            })
        }

        if (error instanceof Exception) {
            return ResultDatabase.failure<T>({ title: 'Database', ...error.getError() })
        }

        if (error instanceof Error) {
            return ResultDatabase.failure<T>({ title: 'Database', ...error })
        }

        if (error instanceof Result) {
            return ResultDatabase.failure<T>({ ...error.getError() })
        }

        return ResultDatabase.failure<T>({ title: 'Database', message: 'Error on operation database', ...error })
    }
}
