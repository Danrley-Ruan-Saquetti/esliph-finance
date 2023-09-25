import { ModelSchemaArgs } from '../../common/model.schema'
import { DatabaseController } from './database.controller'

export class Schema<ModelArgs, ModelSchema = ModelArgs & ModelSchemaArgs> {
    protected database: DatabaseController

    constructor(
        private name: string,
        private attributes: string[] = [],
    ) {
        this.database = new DatabaseController()
    }

    create(attributes = this.attributes) {
        const sql = attributes.join(', ')
        const TEMPLATE = `CREATE TABLE IF NOT EXISTS ${this.name} (id INTEGER PRIMARY KEY AUTOINCREMENT, ${sql}, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP)`

        this.database.run(TEMPLATE)
    }
}
