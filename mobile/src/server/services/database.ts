import { Result } from '@esliph/common'
import { Service } from '@esliph/module'
import * as SQLite from 'expo-sqlite'

export type DatabaseServiceOptions = {
    log: boolean
}

@Service({ name: 'global.service.database' })
export class DatabaseService {
    private static database = SQLite.openDatabase('portal-finance.db')
    private options: DatabaseServiceOptions

    constructor() {
        this.options = {
            log: true
        }
    }

    updateOptions(options: Partial<DatabaseServiceOptions>) {
        this.options.log = options.log
    }

    async createTable(tableName: string, properties: string[], options?: { dropIfAlreadyExists?: boolean, ignoreIfAlreadyExists?: boolean }) {
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

    async query(sql: string, values: any[] = []) {
        const response = await this.exec(sql, values, true)

        return response
    }

    async exec(sql: string, values: any[] = [], readOnly = false) {
        const response = await this.database.execAsync([{ sql: sql, args: values }], readOnly)

        console.log(response)

        // @ts-expect-error
        if (response[0].error) {
            if (this.options.log) {
                // @ts-expect-error
                console.error(response[0].error)
            }

            // @ts-expect-error
            return Result.failure({ title: 'Database', message: response[0].error })
        }

        // @ts-expect-error
        return Result.success(response[0].rows as any[])
    }

    get database() {
        return DatabaseService.database
    }
}
