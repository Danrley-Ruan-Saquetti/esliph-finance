import { Result } from '@esliph/common'
import { Service } from '@esliph/module'
import * as SQLite from 'expo-sqlite'

export type DatabaseServiceOptions = {}

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
            await this.exec(`DROP TABLE IF EXISTS ${tableName}`)
        }

        await this.exec(sql)
    }

    async query<T = any>(sql: string, values: any[] = []) {
        const response = await this.exec<T>(sql, values, true)

        return response
    }

    async exec<T = any>(sql: string, values: any[] = [], readOnly = false) {
        try {
            const response = await this.database.execAsync([{ sql: sql, args: values }], readOnly)

            // @ts-expect-error
            if (response[0].error) {
                // @ts-expect-error
                return Result.failure<T>({ title: 'Database', message: response[0].error })
            }

            // @ts-expect-error
            return Result.success<T>(response[0].rows as any[])
        } catch (err: any) {
            if (err instanceof SQLite.SQLError) {
                return Result.failure<T>({ title: 'Database', message: err.message })
            }

            return Result.failure<T>({ title: 'Database', message: err.message })
        }
    }

    get database() {
        return DatabaseService.database
    }
}
