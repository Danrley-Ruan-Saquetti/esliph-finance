import { getEnv, ObserverEvent } from '@esliph/util-node'
import { Database } from 'sqlite3'

const PATH_DATABASE = getEnv({ name: 'DATABASE_URL', defaultValue: './storage/database.db' })

export class DatabaseController {
    private static database: Database
    private static observer = new ObserverEvent()

    connect() {
        return DatabaseController.connect()
    }

    run(sql: string) {
        return DatabaseController.run(sql)
    }

    static connect() {
        DatabaseController.database = new Database(PATH_DATABASE, err => this.emitError(err))
    }

    static close() {
        this.database.close(err => this.emitError(err))
    }

    static run(sql: string) {
        this.database.run(sql, err => this.emitError(err))
    }

    private static emitError(err: any) {
        if (!err) {
            return
        }

        this.observer.emit('error', err)
    }
}
