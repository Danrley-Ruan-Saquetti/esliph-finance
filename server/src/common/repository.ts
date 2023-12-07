import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { ErrorResultInfo, Result } from '@esliph/common'
import { DatabaseException, Exception, ServerInternalErrorException } from '@common/exceptions'
import { DatabaseService, Prisma } from '@services/database.service'
import { isNull } from '../util'

type RepositoryResponseOptions = {
    noThrow: boolean
    error: Partial<ErrorResultInfo>
}

@Service()
export class Repository {
    constructor(@Injection.Inject('database') protected database: DatabaseService) { }

    protected performResponse(res: any, options: Partial<RepositoryResponseOptions> = {}) {
        return Repository.validResultRepository(res, options)
    }

    protected performError(error: any, options: Partial<RepositoryResponseOptions> = {}) {
        return Repository.validErrorRepository(error, options)
    }

    private static validResultRepository(result: any, options: Partial<RepositoryResponseOptions> = {}) {
        if (!options.noThrow) {
            if (result instanceof Result && (!result.isSuccess() || isNull(result.getValue()))) {
                throw new DatabaseException({ ...result.getError(), ...options.error })
            }

            if (isNull(result)) {
                throw new DatabaseException({ ...result.getError(), ...options.error })
            }
        }

        return result
    }

    private static validErrorRepository(error: any, options: Partial<RepositoryResponseOptions> = {}) {
        if (error instanceof Error) {
            console.log(error)

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new DatabaseException({ causes: [], title: 'Database', ...error, ...options.error })
            }

            if (error instanceof Exception) {
                throw error
            }

            throw new ServerInternalErrorException({ ...error })
        }

        return error
    }
}