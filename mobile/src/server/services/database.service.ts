import { Result } from '@esliph/common'
import { Service } from '@esliph/module'
import * as SQLite from 'expo-sqlite'
import { DatabaseException, ServerInternalErrorException } from '@common/exceptions'

export type DatabaseServiceOptions = {}
export type RowQuery<T = { [x: string]: any }> = { [x in keyof T]: T[x] }
export type QueryOptions = { uniqueResult: boolean }
export type ExecOptions = QueryOptions & { readOnly: boolean }

@Service({ name: 'global.service.database' })
export class DatabaseService {
    private static database = SQLite.openDatabase('portal-finance.db')

    async createTable(tableName: string, properties: string[], options?: { dropIfAlreadyExists?: boolean; ignoreIfAlreadyExists?: boolean }) {
        const sqlProperties = properties.join(', ')
        let sqlCreateBase = 'CREATE TABLE '

        if (options?.ignoreIfAlreadyExists) {
            sqlCreateBase += 'IF NOT EXISTS '
        }

        const sql = sqlCreateBase + tableName + ` (${sqlProperties})`

        if (options?.dropIfAlreadyExists) {
            await this.runSql(`DROP TABLE IF EXISTS ${tableName}`)
        }

        await this.runSql(sql)
    }

    async queryOrThrow<T = any>(sql: string, values: any[] = []) {
        const response = await this.query<T>(sql, values)

        if (!response.isSuccess()) {
            throw new DatabaseException(response.getError())
        }

        return response
    }

    async queryOneOrThrow<T = any>(sql: string, values: any[] = []) {
        const response = await this.queryOne<T>(sql, values)

        if (!response.isSuccess()) {
            throw new DatabaseException(response.getError())
        }

        return response
    }

    async execOrThrow<T = any>(sql: string, values: any[] = [], options: Partial<ExecOptions> = {}) {
        const response = await this.exec<T>(sql, values)

        if (!response.isSuccess()) {
            throw new DatabaseException(response.getError())
        }

        return response
    }

    async query<T = any>(sql: string, values: any[] = []) {
        const response = await this.runSql<T>(sql, values, { readOnly: true })

        return response
    }

    async queryOne<T = any>(sql: string, values: any[] = []) {
        const response = await this.runSql<T>(sql, values, { readOnly: true, uniqueResult: true })

        return response
    }

    async exec<T = any>(sql: string, values: any[] = [], options: Partial<ExecOptions> = {}) {
        const response = await this.runSql<T>(sql, values, { ...options })

        return response
    }

    private async runSql<T = any>(sql: string, values: any[] = [], options: Partial<ExecOptions> = {}) {
        try {
            const response: { rows: TemplateStringsArray[]; error?: SQLite.ResultSetError['error'] }[] = (await this.database.execAsync(
                [{ sql: sql, args: values }],
                !!options.readOnly,
            )) as any

            if (response[0].error) {
                return Result.failure<T>({ title: 'Database', ...response[0].error })
            }

            const rows: any[] = []

            response[0].rows.map(row => {
                const rowTranspiler: any = {}

                Object.keys(row).map(key => {
                    rowTranspiler[this.converterAttributeToSystem(key)] = row[key as keyof typeof row]
                })

                rows.push(rowTranspiler)
            })

            if (options.uniqueResult) {
                return Result.success<T>(rows[0] ?? {})
            }

            return Result.success<T>(rows as any)
        } catch (err: any) {
            if (err instanceof SQLite.SQLError) {
                return Result.failure<T>({ title: 'Database', message: err.message })
            }

            throw new ServerInternalErrorException({ ...err })
        }
    }

    get database() {
        return DatabaseService.database
    }

    private converterAttributeToSystem(value: string) {
        return value.replace(/_./g, function (match) {
            return match.charAt(1).toUpperCase()
        })
    }

    private converterAttributeToDatabase(value: string) {
        return value.replace(/[A-Z]/g, function (match) {
            return '_' + match.toLowerCase()
        })
    }
}
