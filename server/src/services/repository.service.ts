import { Injection } from '@esliph/injection'
import { Service } from '@esliph/module'
import { ErrorResultInfo } from '@esliph/common'
import { DatabaseService, Prisma } from '@services/database.service'
import { isNull } from '@util'
import { ResultDatabase } from '@common/result.database'
import { CodeGeneratorService } from '@services/code-generator.service'

export type RepositoryHandleResponseOptions = { noAcceptNullable?: boolean, error: ErrorResultInfo }
export type RepositoryHandleErrorOptions = { error: ErrorResultInfo }

export type RepositoryWhereArgs = {}
export type RepositorySelectArgs = ''
export type RepositoryPagination = {
    pageIndex: number
    limite: number
}
export type RepositoryQuery = {
    where: RepositoryWhereArgs
    select: { [x in RepositorySelectArgs]?: boolean }
    page: RepositoryPagination
}

@Service({ name: 'global.service.repository' })
export class Repository {
    constructor(
        @Injection.Inject('database') protected database: DatabaseService,
        @Injection.Inject('code-generator') protected codeGeneratorService: CodeGeneratorService,
    ) { }

    transaction() {
        const db = this.database.instance
        const code = this.codeGeneratorService.generateCode({
            template: 'XXXXX',
            charactersToReplace: ['X'],
            valuesAllowed: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        })

        async function begin() {
            await db.$executeRawUnsafe('BEGIN', code)
        }

        async function commit() {
            await db.$executeRawUnsafe('COMMIT', code)
        }

        async function rollback() {
            await db.$executeRawUnsafe('ROLLBACK', code)
        }

        return { begin, commit, rollback }
    }

    getDatabase() {
        return this.database.instance
    }

    protected handleResponse<T = any>(res: T | null, options: RepositoryHandleResponseOptions = { error: { message: '', title: '' } }) {
        if (options.noAcceptNullable) {
            if (isNull(res)) {
                return ResultDatabase.failure<T>({ ...options.error })
            }
        }

        return ResultDatabase.success<T>(res as T)
    }

    protected handleError<T = any>(err: any, options: RepositoryHandleErrorOptions) {
        if (err instanceof Prisma.PrismaCustomerKnownRequestError) {
            return ResultDatabase.errorOperation<T>({
                ...err,
                ...options.error,
                causes: { message: err.message, origin: (err.meta as any).target.join(';') } as any,
            })
        }

        return ResultDatabase.errorOperation<T>({ ...err, ...options.error })
    }
}
