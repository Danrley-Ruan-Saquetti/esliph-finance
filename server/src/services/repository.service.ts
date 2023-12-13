import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { ErrorResultInfo } from '@esliph/common'
import { DatabaseService, Prisma } from '@services/database.service'
import { isNull } from '@util'
import { ResultDatabase } from '@common/result.database'

export type RepositoryHandleResponseOptions = { noAcceptNullable?: boolean, error: ErrorResultInfo }
export type RepositoryHandleErrorOptions = { error: ErrorResultInfo }

@Service()
export class Repository {
    constructor(@Injection.Inject('database') protected database: DatabaseService) { }

    protected handleResponse<T = any>(res: any, options: RepositoryHandleResponseOptions) {
        if (options.noAcceptNullable) {
            if (isNull(res)) {
                return ResultDatabase.failure<T>({ ...options.error })
            }
        }

        return ResultDatabase.success<T>(res)
    }

    protected handleError<T = any>(err: any, options: RepositoryHandleErrorOptions) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            return ResultDatabase.errorOperation<T>({
                ...options.error,
                ...err,
                causes: { message: err.message, origin: (err.meta as any).target.join(';') } as any,
            })
        }

        if (err instanceof Error) {
            return ResultDatabase.errorOperation<T>({ ...err, ...options.error })
        }

        return ResultDatabase.errorOperation<T>({ ...err, ...options.error })
    }
}
