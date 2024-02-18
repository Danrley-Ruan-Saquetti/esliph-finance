import { Injection, Service, ErrorResultInfo } from '@core'
import { isArray, isNull } from '@util'
import { ResultDatabase } from '@common/result.database'
import { CodeGeneratorService, GenerateCodeOptions } from '@services/code-generator.service'
import { DatabaseService, Prisma } from '@services/database.service'

export type RepositoryHandleResponseOptions = { noAcceptNullable?: boolean, error: ErrorResultInfo }
export type RepositoryHandleErrorOptions = { error: ErrorResultInfo }

@Service({ name: 'global.service.repository' })
export class Repository {
    private static TEMPLATE_CODE_TRANSACTION: GenerateCodeOptions = {
        template: 'XXXXX',
        charactersToReplace: ['X'],
        valuesAllowed: '0123456789'.split('')
    }

    constructor(
        @Injection.Inject('database') protected database: DatabaseService,
        @Injection.Inject('code-generator') protected codeGeneratorService: CodeGeneratorService,
    ) { }

    transaction() {
        const db = this.database.instance
        const code = this.codeGeneratorService.generateCode(Repository.TEMPLATE_CODE_TRANSACTION)

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
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            const target = (err.meta as any).target

            return ResultDatabase.errorOperation<T>({
                ...err,
                ...options.error,
                causes: { message: err.meta?.cause || err.message, origin: err.meta?.modelName || (isArray(target) ? target : [target]).join(';') } as any,
            })
        }

        return ResultDatabase.errorOperation<T>({ ...err, ...options.error })
    }
}
